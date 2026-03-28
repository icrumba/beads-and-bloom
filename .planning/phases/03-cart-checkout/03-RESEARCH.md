# Phase 3: Cart & Checkout - Research

**Researched:** 2026-03-28
**Domain:** E-commerce cart state management, Stripe payment integration, transactional email, webhook processing
**Confidence:** HIGH

## Summary

Phase 3 transforms the storefront into a functioning e-commerce store. The core technical domains are: (1) client-side cart state with Zustand persisted to localStorage, (2) Stripe Embedded Checkout via Server Actions, (3) webhook-driven order creation with idempotency, and (4) transactional email via Resend + React Email. All four are well-documented patterns with mature libraries.

The biggest technical risks are Zustand hydration mismatches in Next.js 15's Server Component model (solved with a known pattern), webhook idempotency (solved by checking stripeSessionId before inserting), and the Windows path workaround already established in Phase 1 (`node node_modules/...` pattern). The database schema already has all required tables (orders, order_items, customers, charity_totals) from Phase 1.

**Primary recommendation:** Use Server Actions for Stripe session creation (no API routes except the webhook endpoint which must be a Route Handler), Zustand with persist middleware and a hydration-safe wrapper, and send confirmation emails from inside the webhook handler (not the confirmation page) to guarantee delivery.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Slide-out cart drawer (reuses shadcn Sheet component from mobile nav) -- appears from right when "Add to Cart" is tapped. User stays on the current page.
- **D-02:** Quantity controls: +/- buttons with trash icon to remove. Min quantity 1, no max.
- **D-03:** Cart state managed with Zustand, persisted to localStorage (survives page refresh and navigation).
- **D-04:** Cart icon in header shows item count badge when cart has items.
- **D-05:** Single-page checkout with Stripe Embedded Checkout (not redirect). Customer stays on beadsandbloom.com domain for trust.
- **D-06:** Required fields before Stripe: customer name, email, shipping address (street, city, state, zip). Phone optional.
- **D-07:** Flat-rate $5 shipping shown in order summary. No shipping calculation needed.
- **D-08:** Guest checkout only -- no account creation, no login.
- **D-09:** Use Next.js Server Actions (not API routes) for Stripe checkout session creation.
- **D-10:** On product detail page, if product.customizable is true, show clickable color swatches. User selects colors before adding to cart.
- **D-11:** If product is not customizable, show color info as display-only (no selection needed).
- **D-12:** After Stripe payment succeeds, redirect to /order/confirmation?session_id={id} page showing order summary, estimated delivery, and charity donation mention.
- **D-13:** Confirmation page copy: "Thank you! Your order is on its way." + "Every order includes a handwritten thank-you note." + "$1 from your purchase is being donated to The Storehouse."
- **D-14:** Order confirmation email via Resend with: order number, items purchased, shipping address, estimated delivery, charity donation mention, thank-you note mention.
- **D-15:** Optional text field in cart drawer labeled "Add a gift message (optional)". 150 character limit.
- **D-16:** Gift message stored with the order and visible in admin dashboard (Phase 4).
- **D-17:** Stripe webhook at /api/webhook handles checkout.session.completed event. Creates order in database, creates customer record (or updates existing by email), increments charity counter by $1.
- **D-18:** Webhook must be idempotent -- check if order already exists for the Stripe session before creating.

### Claude's Discretion
- Loading states during checkout (skeleton, spinner, or progress bar)
- Error handling UX (toast notifications vs inline errors)
- Cart empty state messaging
- Stripe webhook retry handling approach

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STORE-03 | User can add products to cart, update quantities, and remove items | Zustand store with persist middleware; cart drawer with Sheet component; +/- quantity controls |
| STORE-04 | User can complete purchase via Stripe guest checkout (no account required) | Stripe Embedded Checkout with `ui_mode: 'embedded'` via Server Action; no auth required |
| STORE-05 | User receives order confirmation email after successful payment | Resend + React Email template triggered from webhook handler after order creation |
| STORE-09 | User can select custom color options on eligible products | Extend existing ColorSwatches to be interactive when product.customizable is true; store selections in cart item |
| STORE-11 | User can add a gift message at checkout for the recipient | Text field in cart drawer, 150 char limit, stored in orders.giftMessage column |
| STORE-12 | Checkout confirmation page mentions a handwritten thank-you note is included with every order | Static copy on /order/confirmation page per D-13 |
</phase_requirements>

## Standard Stack

### Core (new packages for this phase)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| stripe | ^21.0.1 | Server-side Stripe API | Official Node SDK. Creates checkout sessions, verifies webhook signatures, retrieves session details. |
| @stripe/stripe-js | ^9.0.0 | Client-side Stripe loader | Loads Stripe.js for Embedded Checkout. Required by @stripe/react-stripe-js. |
| @stripe/react-stripe-js | ^6.0.0 | React Stripe components | Provides EmbeddedCheckoutProvider and EmbeddedCheckout components. |
| zustand | ^5.0.12 | Cart state management | 1kb store with persist middleware for localStorage. Already specified in CLAUDE.md stack. |
| resend | ^6.9.4 | Transactional email API | Developer-first email with first-class Next.js support. Free tier: 100 emails/day. |
| @react-email/components | ^1.0.10 | Email template components | Build order confirmation emails as React components. Type-safe, version-controlled. |
| sonner | ^2.0.7 | Toast notifications | Lightweight toast library for "Added to cart", error messages. Used by shadcn/ui. |

### Already Installed (from Phase 1/2)

| Library | Version | Relevance to Phase 3 |
|---------|---------|----------------------|
| zod | ^4.3.6 | Validate checkout form inputs, Server Action inputs |
| drizzle-orm | ^0.45.2 | Order creation queries, customer upsert, charity counter increment |
| next | 15.5.14 | Server Actions, Route Handlers for webhook |
| shadcn components | Sheet, Button, Badge, Card, Separator, Skeleton | Cart drawer (Sheet), UI controls, loading states |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand persist to localStorage | Cookie-based persistence | Cookies avoid hydration mismatch entirely but have 4kb size limit -- fine for cart but adds complexity. localStorage is the established pattern per CLAUDE.md. |
| Sonner | react-hot-toast | Similar API, but sonner is the shadcn/ui blessed choice and already in the stack spec. |
| Resend | SendGrid | SendGrid has higher volume free tier but worse DX. Resend is the locked stack choice. |

**Installation:**
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js zustand resend @react-email/components sonner --ignore-scripts
```

Note: `--ignore-scripts` is required due to Windows path issue with `&` character in project path (established Phase 1 pattern).

**Version verification:** All versions checked against npm registry on 2026-03-28.

## Architecture Patterns

### Recommended Project Structure (new files for Phase 3)
```
src/
├── app/
│   ├── api/
│   │   └── webhook/
│   │       └── route.ts            # Stripe webhook handler (Route Handler, NOT Server Action)
│   ├── checkout/
│   │   └── page.tsx                # Checkout page with Stripe Embedded Checkout
│   └── order/
│       └── confirmation/
│           └── page.tsx            # Post-payment confirmation page
├── actions/
│   └── stripe.ts                   # Server Action: createCheckoutSession
├── components/
│   ├── cart/
│   │   ├── cart-drawer.tsx         # Slide-out Sheet with cart contents
│   │   ├── cart-icon.tsx           # Header cart icon with count badge
│   │   ├── cart-item.tsx           # Individual cart item row (+/- buttons, remove)
│   │   └── gift-message.tsx        # Optional gift message textarea
│   ├── checkout/
│   │   ├── checkout-form.tsx       # Customer info form (name, email, address)
│   │   └── stripe-checkout.tsx     # EmbeddedCheckoutProvider wrapper
│   └── shop/
│       └── color-swatches.tsx      # MODIFY existing -- add interactive mode
├── emails/
│   └── order-confirmation.tsx      # React Email template
├── lib/
│   ├── stripe.ts                   # Stripe instance singleton
│   ├── cart-store.ts               # Zustand store with persist middleware
│   └── queries.ts                  # EXTEND with order/customer mutations
└── types/
    └── index.ts                    # EXTEND with CartItem type
```

### Pattern 1: Zustand Cart Store with Hydration-Safe Wrapper

**What:** Zustand persist middleware saves cart to localStorage, but SSR renders with empty cart. A hydration-safe hook prevents mismatch.

**When to use:** Any Zustand store with persist middleware in Next.js App Router.

**Example:**
```typescript
// src/lib/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  slug: string;
  customColors?: string[];
};

type CartStore = {
  items: CartItem[];
  giftMessage: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, customColors?: string[]) => void;
  updateQuantity: (productId: number, quantity: number, customColors?: string[]) => void;
  setGiftMessage: (message: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      giftMessage: '',
      addItem: (item) => set((state) => {
        // Check if same product with same custom colors already exists
        const key = `${item.productId}-${(item.customColors || []).sort().join(',')}`;
        const existing = state.items.find(
          (i) => `${i.productId}-${(i.customColors || []).sort().join(',')}` === key
        );
        if (existing) {
          return {
            items: state.items.map((i) =>
              `${i.productId}-${(i.customColors || []).sort().join(',')}` === key
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (productId, customColors) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId &&
            JSON.stringify(i.customColors?.sort()) === JSON.stringify(customColors?.sort()))
        ),
      })),
      updateQuantity: (productId, quantity, customColors) => set((state) => ({
        items: state.items.map((i) =>
          i.productId === productId &&
          JSON.stringify(i.customColors?.sort()) === JSON.stringify(customColors?.sort())
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        ),
      })),
      setGiftMessage: (message) => set({ giftMessage: message.slice(0, 150) }),
      clearCart: () => set({ items: [], giftMessage: '' }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce(
        (sum, i) => sum + parseFloat(i.price) * i.quantity, 0
      ),
    }),
    { name: 'beads-bloom-cart' }
  )
);
```

```typescript
// src/lib/use-hydrated-store.ts — prevents hydration mismatch
import { useState, useEffect } from 'react';

export function useHydratedStore<T>(store: () => T, fallback: T): T {
  const [hydrated, setHydrated] = useState(false);
  const storeValue = store();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? storeValue : fallback;
}

// Usage in components:
// const itemCount = useHydratedStore(() => useCartStore.getState().totalItems(), 0);
```

### Pattern 2: Stripe Embedded Checkout via Server Action

**What:** Server Action creates Stripe Checkout Session with `ui_mode: 'embedded'`, returns client_secret to EmbeddedCheckoutProvider.

**When to use:** D-05 and D-09 require this exact pattern.

**Example:**
```typescript
// src/actions/stripe.ts
'use server';
import { stripe } from '@/lib/stripe';

export async function createCheckoutSession(formData: {
  items: { price: string; name: string; quantity: number }[];
  customerEmail: string;
  shippingAddress: { line1: string; city: string; state: string; zip: string; country: string };
  giftMessage?: string;
}) {
  const lineItems = formData.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(parseFloat(item.price) * 100), // Stripe uses cents
    },
    quantity: item.quantity,
  }));

  // Add flat-rate shipping as a line item
  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: { name: 'Flat-rate shipping' },
      unit_amount: 500, // $5.00
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    mode: 'payment',
    line_items: lineItems,
    customer_email: formData.customerEmail,
    metadata: {
      gift_message: formData.giftMessage || '',
      shipping_address: JSON.stringify(formData.shippingAddress),
    },
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret!;
}
```

```typescript
// src/components/checkout/stripe-checkout.tsx
'use client';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
import { createCheckoutSession } from '@/actions/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeCheckout({ checkoutData }: { checkoutData: Parameters<typeof createCheckoutSession>[0] }) {
  const fetchClientSecret = useCallback(
    () => createCheckoutSession(checkoutData),
    [checkoutData]
  );

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
```

### Pattern 3: Idempotent Webhook Handler

**What:** Route Handler (not Server Action) at `/api/webhook/route.ts` verifies Stripe signature, checks for duplicate processing, creates order + customer + increments charity counter in a transaction.

**When to use:** D-17 and D-18 require this.

**Example:**
```typescript
// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { orders, orderItems, customers, charityTotals } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency check (D-18)
    const existing = await db.select().from(orders)
      .where(eq(orders.stripeSessionId, session.id)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ received: true }); // Already processed
    }

    // Create order, customer, increment charity counter...
    // (full implementation in plan tasks)
  }

  return NextResponse.json({ received: true });
}
```

**Critical:** The webhook endpoint MUST use `req.text()` (not `req.json()`) to get the raw body for signature verification. This is the #1 webhook implementation error.

### Pattern 4: React Email Order Confirmation

**What:** Type-safe email template as a React component, sent via Resend from webhook handler.

**Example:**
```typescript
// src/emails/order-confirmation.tsx
import { Html, Head, Body, Container, Text, Section, Hr } from '@react-email/components';

type OrderConfirmationProps = {
  orderNumber: number;
  customerName: string;
  items: { name: string; quantity: number; price: string; customColors?: string[] }[];
  shippingAddress: { line1: string; city: string; state: string; zip: string };
  totalAmount: string;
};

export function OrderConfirmationEmail(props: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <Container>
          <Text>Thank you, {props.customerName}!</Text>
          <Text>Your order #{props.orderNumber} is confirmed.</Text>
          {/* Items list, address, totals */}
          <Hr />
          <Text>Every order includes a handwritten thank-you note.</Text>
          <Text>$1 from your purchase is being donated to The Storehouse.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Anti-Patterns to Avoid

- **Sending email from confirmation page instead of webhook:** The confirmation page might not load (user closes tab). Always send from the webhook handler which is guaranteed to fire.
- **Using `req.json()` in webhook handler:** Breaks Stripe signature verification. Must use `req.text()` for raw body.
- **Storing cart in Server Component state:** Cart must be client-side only (Zustand). Server Components cannot hold interactive state.
- **Creating API routes for checkout session:** D-09 explicitly requires Server Actions, not API routes. Only the webhook uses a Route Handler (webhooks cannot be Server Actions -- they need raw request access).
- **Trusting client-side price data:** Always look up product prices server-side when creating the Stripe session. The cart sends product IDs; the server fetches current prices from the database.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Payment form / PCI compliance | Custom credit card form | Stripe Embedded Checkout | PCI compliance is complex. Stripe handles it entirely. |
| Email rendering | HTML string templates | React Email components | Email HTML is notoriously broken across clients. React Email handles it. |
| Toast notifications | Custom notification system | Sonner | Already integrated with shadcn/ui, handles stacking, animations, accessibility. |
| Cart state management | React Context + useReducer | Zustand with persist | Context causes re-renders on every cart change. Zustand is surgical. |
| Webhook signature verification | Manual HMAC comparison | `stripe.webhooks.constructEvent()` | Timing-safe comparison, handles signature format changes. |

## Common Pitfalls

### Pitfall 1: Zustand Hydration Mismatch
**What goes wrong:** Cart badge shows "3 items" on server but localStorage has different data, causing React hydration error.
**Why it happens:** Server renders with empty Zustand store, client hydrates with localStorage data.
**How to avoid:** Use a hydration-safe hook that returns fallback value during SSR, then real value after useEffect. Alternatively, suppress hydration warnings on the cart count element using `suppressHydrationWarning`.
**Warning signs:** Console errors mentioning "Hydration failed because the server rendered HTML didn't match the client."

### Pitfall 2: Webhook Raw Body Parsing
**What goes wrong:** Stripe signature verification fails with "No signatures found matching the expected signature for payload."
**Why it happens:** Next.js App Router auto-parses JSON bodies. `req.json()` returns parsed object, but Stripe needs the raw string for signature verification.
**How to avoid:** Always use `const body = await req.text()` in the webhook Route Handler. Do NOT use `req.json()`.
**Warning signs:** 400 errors on webhook endpoint in Stripe dashboard.

### Pitfall 3: Stripe Amounts in Cents
**What goes wrong:** Customer is charged $0.06 instead of $6.00, or $600.00 instead of $6.00.
**Why it happens:** Stripe uses cents (integer). Products store price as "6.00" (string). Must multiply by 100 and round.
**How to avoid:** `Math.round(parseFloat(price) * 100)` when creating line items. Verify with Stripe test mode.
**Warning signs:** Stripe dashboard shows unexpected amounts.

### Pitfall 4: Double Order Creation
**What goes wrong:** Same order appears twice in the database, charity counter incremented twice.
**Why it happens:** Stripe retries webhooks up to 35 times over 3 days if endpoint returns non-2xx. Network timeout can cause Stripe to retry even if the first attempt succeeded.
**How to avoid:** Check `orders.stripeSessionId` before creating (D-18). Return 200 immediately for known sessions.
**Warning signs:** Duplicate entries in orders table with same stripeSessionId.

### Pitfall 5: Cart Item Identity with Custom Colors
**What goes wrong:** User adds "Ocean Bracelet" in blue, then adds same bracelet in green -- they merge into one cart item instead of being separate.
**Why it happens:** Cart deduplication only checks productId, not customColors.
**How to avoid:** Cart item identity must be a composite of productId + sorted customColors array. Same product with different color selections = different cart items.
**Warning signs:** Custom color selections disappearing when adding same product with different colors.

### Pitfall 6: Windows Path with `&` Character
**What goes wrong:** npm scripts fail because "Beads & Bloom" path breaks shell parsing.
**Why it happens:** `&` is a shell metacharacter. npm .bin shims don't escape it.
**How to avoid:** Continue using `node node_modules/.bin/...` or `node node_modules/next/dist/bin/next` pattern from Phase 1. Use `--ignore-scripts` on `npm install`.
**Warning signs:** "The system cannot find the path specified" or command splitting at `&`.

## Code Examples

### Extending queries.ts with Order Mutations
```typescript
// Add to src/lib/queries.ts
import { orders, orderItems, customers, charityTotals } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function createOrder(data: {
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: Address;
  giftMessage?: string;
  items: { productId: number; quantity: number; unitPrice: string; customColors?: string[] }[];
  totalAmount: string;
}) {
  // Upsert customer by email
  const [customer] = await db
    .insert(customers)
    .values({
      email: data.customerEmail,
      name: data.customerName,
      phone: data.customerPhone,
      address: data.shippingAddress,
    })
    .onConflictDoUpdate({
      target: customers.email,
      set: {
        name: data.customerName,
        phone: data.customerPhone,
        address: data.shippingAddress,
        orderCount: sql`${customers.orderCount} + 1`,
      },
    })
    .returning();

  // Create order
  const [order] = await db
    .insert(orders)
    .values({
      stripeSessionId: data.stripeSessionId,
      customerId: customer.id,
      status: 'new',
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      giftMessage: data.giftMessage,
    })
    .returning();

  // Create order items
  await db.insert(orderItems).values(
    data.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      customColors: item.customColors,
    }))
  );

  // Increment charity counter by $1
  await db
    .update(charityTotals)
    .set({
      totalDonated: sql`${charityTotals.totalDonated} + 1`,
      orderCount: sql`${charityTotals.orderCount} + 1`,
      lastUpdated: new Date(),
    })
    .where(eq(charityTotals.id, 1));

  return order;
}
```

### Interactive Color Swatches (extending existing component)
```typescript
// The existing ColorSwatches is display-only.
// For customizable products, create an InteractiveColorSwatches that:
// - Renders the same swatches but with click handlers
// - Shows a selected ring around chosen colors
// - Calls a callback with selected colors array
// - Reuses the COLOR_MAP from the existing component
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stripe Checkout redirect | Stripe Embedded Checkout (iframe) | 2024 | Customer stays on your domain. Higher conversion. |
| API routes for Stripe sessions | Server Actions with `ui_mode: 'embedded'` | Next.js 14+ | Fewer files, automatic loading states, type-safe. |
| `@stripe/stripe-js` loadStripe in useEffect | `loadStripe` at module level with `@stripe/react-stripe-js` | 2024 | Cleaner, no unnecessary re-initialization. |
| HTML email templates | React Email components | 2024 | Type-safe, version-controlled, preview in dev. |

**Deprecated/outdated:**
- `stripe.checkout.sessions.create({ mode: 'payment' })` with `success_url` redirect -- still works but Embedded is the recommended UX path for 2026
- Stripe `@stripe/stripe-js` version < 5.x -- ensure using ^9.0.0 for Embedded Checkout v2 compatibility

## Open Questions

1. **Stripe metadata size limit for cart items**
   - What we know: Stripe metadata values have a 500-character limit per key. Gift message (150 chars) fits. Cart item details (product IDs, custom colors) may need to be stored in our DB and referenced by session ID rather than crammed into metadata.
   - What's unclear: Whether to pass full cart detail via metadata or reconstruct from session line items in the webhook.
   - Recommendation: Store cart details (custom colors, product IDs) in Stripe metadata as JSON. If it exceeds 500 chars, use multiple metadata keys or store a temporary cart reference in our DB keyed by a nonce passed in metadata.

2. **Shipping address collection in Stripe vs custom form**
   - What we know: D-06 requires collecting name, email, shipping address BEFORE Stripe. Stripe Embedded Checkout can also collect shipping.
   - What's unclear: Whether to collect address in our form and pass to Stripe, or let Stripe collect it.
   - Recommendation: Collect in our custom form (per D-06) and pass `customer_email` to Stripe. This gives us the data before payment for the order record. Stripe still collects payment details.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | Yes | (managed by Next.js) | -- |
| Stripe CLI | Local webhook testing | Yes | 1.35.1 | Use Stripe dashboard webhook logs (slower DX) |
| Neon Postgres | Order storage | Yes (configured) | Managed | -- |
| npm | Package installation | Yes | (system) | -- |

**Missing dependencies with no fallback:** None

**Missing dependencies with fallback:** None

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual testing + Stripe test mode |
| Config file | None -- no automated test framework installed yet |
| Quick run command | `stripe listen --forward-to localhost:3000/api/webhook` + manual checkout flow |
| Full suite command | Manual end-to-end checkout with Stripe test card |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STORE-03 | Add/update/remove cart items | manual | Open dev server, add products, verify cart drawer | N/A |
| STORE-04 | Complete Stripe guest checkout | manual | Use Stripe test card 4242424242424242, verify session creation | N/A |
| STORE-05 | Order confirmation email received | manual | Check Resend dashboard after test checkout | N/A |
| STORE-09 | Select custom colors on eligible products | manual | Visit customizable product, select colors, add to cart, verify in drawer | N/A |
| STORE-11 | Add gift message at checkout | manual | Type message in cart drawer, complete checkout, verify in DB | N/A |
| STORE-12 | Confirmation page shows thank-you note mention | manual | Complete checkout, verify /order/confirmation page copy | N/A |

### Sampling Rate
- **Per task commit:** Dev server running, visual check of changed component
- **Per wave merge:** Full checkout flow with Stripe test mode
- **Phase gate:** Complete end-to-end purchase with test card, verify order in DB, verify email in Resend dashboard, verify charity counter incremented

### Wave 0 Gaps
- No automated test framework installed -- all testing is manual for this phase
- Stripe CLI webhook forwarding must be running during checkout testing

## Sources

### Primary (HIGH confidence)
- [Stripe Embedded Checkout Quickstart (Next.js)](https://docs.stripe.com/checkout/embedded/quickstart?client=next) -- official Stripe docs for embedded checkout pattern
- [Stripe Webhook Signature Verification](https://docs.stripe.com/webhooks/signatures) -- constructEvent pattern
- [Zustand GitHub Discussions #1382](https://github.com/pmndrs/zustand/discussions/1382) -- hydration mismatch solutions
- [Resend Next.js Integration](https://resend.com/docs/send-with-nextjs) -- official Resend docs

### Secondary (MEDIUM confidence)
- [Stripe + Next.js 15 Complete Guide](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/) -- Server Actions pattern, verified against official docs
- [Stripe + Next.js 2026 Edition](https://dev.to/sameer_saleem/the-ultimate-guide-to-stripe-nextjs-2026-edition-2f33) -- Server Action-first architecture
- [Zustand Persist with Next.js](https://blog.abdulsamad.dev/how-to-use-zustands-persist-middleware-in-nextjs) -- hydration-safe patterns

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified against npm registry, versions current
- Architecture: HIGH -- patterns from official Stripe and Zustand docs, well-established in Next.js ecosystem
- Pitfalls: HIGH -- documented in official GitHub issues and Stripe docs, corroborated by multiple sources

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable libraries, unlikely to change)
