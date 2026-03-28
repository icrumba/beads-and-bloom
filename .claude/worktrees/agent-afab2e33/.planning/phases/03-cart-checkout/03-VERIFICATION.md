---
phase: 03-cart-checkout
verified: 2026-03-27T23:30:00Z
status: gaps_found
score: 17/19 must-haves verified
gaps:
  - truth: "Missing npm dependencies prevent build"
    status: failed
    reason: "4 packages imported in code but missing from package.json: zustand, sonner, @stripe/stripe-js, @stripe/react-stripe-js. App will not build."
    artifacts:
      - path: "projects/briefs/beads-and-bloom-website/package.json"
        issue: "Missing zustand, sonner, @stripe/stripe-js, @stripe/react-stripe-js in dependencies"
    missing:
      - "Add zustand to dependencies"
      - "Add sonner to dependencies"
      - "Add @stripe/stripe-js to dependencies"
      - "Add @stripe/react-stripe-js to dependencies"
      - "Run npm install after updating package.json"
  - truth: "Shipping logic inconsistency between cart drawer and Stripe checkout"
    status: partial
    reason: "Cart drawer shows free shipping over $25 but Stripe action always adds $5 flat shipping regardless of cart total. Customer sees free shipping in cart but gets charged $5 at payment."
    artifacts:
      - path: "projects/briefs/beads-and-bloom-website/src/actions/stripe.ts"
        issue: "Always adds $5 shipping line item without checking subtotal against free shipping threshold"
      - path: "projects/briefs/beads-and-bloom-website/src/components/cart/cart-drawer.tsx"
        issue: "Shows FREE_SHIPPING_THRESHOLD = 25 logic that is not mirrored in Stripe session creation"
    missing:
      - "Sync shipping logic: either remove free-shipping-over-$25 from cart drawer, or add the same threshold check to the Stripe action before adding the shipping line item"
human_verification:
  - test: "Add product to cart, complete Stripe checkout, verify webhook creates order"
    expected: "Full end-to-end purchase flow works with real Stripe test keys"
    why_human: "Requires running dev server with Stripe test keys and Stripe CLI for webhook forwarding"
  - test: "Verify cart persistence across page navigation and refresh"
    expected: "Cart items survive navigation between pages and full page refresh"
    why_human: "Requires browser interaction to test localStorage persistence"
  - test: "Verify order confirmation email renders correctly"
    expected: "Email shows order number, items, shipping address, handwritten note mention, charity donation mention"
    why_human: "Requires Resend API key and actual email delivery to verify rendering"
---

# Phase 3: Cart & Checkout Verification Report

**Phase Goal:** Customers can add products to cart and complete a purchase with Stripe -- the path to revenue
**Verified:** 2026-03-27T23:30:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

#### Plan 01: Cart System

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can tap Add to Cart and see cart drawer slide open | VERIFIED | add-to-cart-button.tsx calls addItem + openCart; cart-drawer.tsx uses Sheet with isOpen state |
| 2 | User can increase/decrease quantity with +/- or remove with trash | VERIFIED | cart-item.tsx has Plus/Minus/Trash2 icons wired to updateQuantity/removeItem |
| 3 | Cart persists across page navigation and refresh (localStorage) | VERIFIED | cart-store.ts uses persist middleware with key "beads-bloom-cart" and partialize |
| 4 | Cart icon in header shows item count badge | VERIFIED | cart-icon.tsx uses useHydratedStore for count, renders badge when count > 0; header.tsx imports and renders CartIcon |
| 5 | User can select custom color swatches on customizable products | VERIFIED | add-to-cart-button.tsx renders ColorSwatches with interactive=true and selected/onSelect props |
| 6 | Same product with different colors appears as separate cart items | VERIFIED | cart-store.ts uses composite key (productId + sorted customColors) for deduplication |
| 7 | User can type a gift message up to 150 chars | VERIFIED | gift-message.tsx renders textarea with maxLength=150, cart-store.ts truncates to 150 chars |

#### Plan 02: Stripe Checkout

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 8 | User can navigate to /checkout from cart drawer | VERIFIED | cart-drawer.tsx has Link to /checkout on "Proceed to Checkout" button |
| 9 | User fills in name, email, shipping address | VERIFIED | checkout-form.tsx has full form with zod validation for all fields |
| 10 | Stripe Embedded Checkout appears embedded (not redirect) | VERIFIED | stripe-checkout.tsx uses EmbeddedCheckoutProvider with clientSecret; actions/stripe.ts uses ui_mode "embedded_page" |
| 11 | After payment, redirect to /order/confirmation?session_id={id} | VERIFIED | actions/stripe.ts sets return_url with {CHECKOUT_SESSION_ID}; confirmation page reads session_id param |
| 12 | Confirmation shows thank-you, handwritten note, $1 charity | VERIFIED | confirmation/page.tsx renders "handwritten thank-you note" callout and "$1 from your purchase is being donated to The Storehouse" |
| 13 | Flat-rate $5 shipping included as Stripe line item | VERIFIED | actions/stripe.ts adds "Flat-rate shipping" line item at 500 cents |

#### Plan 03: Webhook & Email

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 14 | Stripe webhook receives checkout.session.completed and creates order | VERIFIED | webhook/route.ts handles event.type === "checkout.session.completed", calls createOrder |
| 15 | Webhook is idempotent (no duplicate orders) | VERIFIED | webhook/route.ts calls getOrderByStripeSession before processing, returns early if exists |
| 16 | Customer record created/updated by email | VERIFIED | queries.ts uses onConflictDoUpdate on customers.email |
| 17 | Charity counter increments by $1 per order | VERIFIED | queries.ts updates charityTotals with totalDonated + 1 and orderCount + 1 |
| 18 | Order confirmation email sent via Resend | VERIFIED | webhook/route.ts calls resend.emails.send with OrderConfirmationEmail react component |
| 19 | Email includes order number, items, address, note mention, charity | VERIFIED | order-confirmation.tsx renders all: orderNumber, items list, shippingAddress, "handwritten thank-you note", "$1 donated to The Storehouse" |

**Score:** 17/19 truths verified (2 gaps found -- 1 blocker, 1 partial)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/cart-store.ts` | Zustand store with persist | VERIFIED | 104 lines, persist middleware, composite key dedup, gift message truncation |
| `src/components/cart/cart-drawer.tsx` | Slide-out Sheet with items, totals | VERIFIED | 123 lines, Sheet component, empty state, subtotal/shipping/total |
| `src/components/cart/cart-icon.tsx` | Header icon with count badge | VERIFIED | 34 lines, useHydratedStore for SSR-safe count |
| `src/components/shop/add-to-cart-button.tsx` | Client component with color selection | VERIFIED | 75 lines, ColorSwatches integration, toast on add |
| `src/components/cart/cart-item.tsx` | Cart item with quantity controls | VERIFIED | 112 lines, +/- buttons, trash icon at quantity 1 |
| `src/components/cart/gift-message.tsx` | Gift message textarea | VERIFIED | 31 lines, 150 char limit with counter |
| `src/lib/stripe.ts` | Stripe singleton | VERIFIED | 5 lines, new Stripe with secret key |
| `src/actions/stripe.ts` | Server Action for checkout session | VERIFIED | 103 lines, zod validation, server-side price lookup, embedded_page mode |
| `src/app/checkout/page.tsx` | Checkout page with form + Stripe | VERIFIED | 72 lines, two-phase UI (form then payment) |
| `src/components/checkout/checkout-form.tsx` | Customer info form | VERIFIED | 362 lines, full form with validation, order summary step |
| `src/components/checkout/stripe-checkout.tsx` | Embedded Checkout wrapper | VERIFIED | 22 lines, EmbeddedCheckoutProvider + EmbeddedCheckout |
| `src/app/order/confirmation/page.tsx` | Post-payment confirmation | VERIFIED | 147 lines, session retrieve, items display, special callouts |
| `src/app/api/webhook/route.ts` | Stripe webhook handler | VERIFIED | 128 lines, signature verification, idempotency, order creation, email send |
| `src/lib/queries.ts` | Order creation + customer upsert | VERIFIED | 124 lines, createOrder with customer upsert, order items, charity increment |
| `src/emails/order-confirmation.tsx` | React Email template | VERIFIED | 298 lines, full styled email with items, address, gift message, special notes |
| `package.json` | All dependencies listed | FAILED | Missing zustand, sonner, @stripe/stripe-js, @stripe/react-stripe-js |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| add-to-cart-button.tsx | cart-store.ts | useCartStore().addItem | WIRED | Import + addItem call + openCart call |
| cart-icon.tsx | cart-store.ts | useHydratedStore for count | WIRED | Import + useHydratedStore wrapping totalItems() |
| cart-drawer.tsx | cart-store.ts | useCartStore for items/actions | WIRED | Reads items, isOpen, totalPrice, totalItems |
| header.tsx | cart-icon.tsx + cart-drawer.tsx | Import + render | WIRED | Both imported and rendered in header |
| checkout-form.tsx | actions/stripe.ts | createCheckoutSession | WIRED | Import + await call with full input |
| actions/stripe.ts | lib/stripe.ts | stripe.checkout.sessions.create | WIRED | Import + session creation |
| confirmation/page.tsx | lib/stripe.ts | sessions.retrieve | WIRED | Import + retrieve + listLineItems |
| webhook/route.ts | lib/queries.ts | createOrder | WIRED | Import + await createOrder with full data |
| webhook/route.ts | emails/order-confirmation.tsx | resend.emails.send with React Email | WIRED | Import + send with OrderConfirmationEmail |
| queries.ts | db/schema.ts | orders, orderItems, customers, charityTotals | WIRED | All tables imported and used in insert/update |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| cart-drawer.tsx | items, totalPrice | useCartStore (localStorage) | Yes -- populated by addItem from product page | FLOWING |
| checkout/page.tsx | items, giftMessage, subtotal | useCartStore (localStorage) | Yes -- same store | FLOWING |
| confirmation/page.tsx | session, lineItems | stripe.checkout.sessions.retrieve | Yes -- real Stripe API call | FLOWING |
| webhook/route.ts | order | createOrder (DB insert) | Yes -- inserts into orders, orderItems, customers, charityTotals | FLOWING |

### Behavioral Spot-Checks

Step 7b: SKIPPED -- cannot run dev server or build due to missing dependencies (zustand, sonner, @stripe/stripe-js, @stripe/react-stripe-js not in package.json). Once dependencies are fixed, build and manual E2E testing should be performed.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| STORE-03 | 03-01 | User can add products to cart, update quantities, and remove items | SATISFIED | cart-store.ts addItem/updateQuantity/removeItem; cart-item.tsx UI controls |
| STORE-04 | 03-02, 03-03 | User can complete purchase via Stripe guest checkout | SATISFIED | Full checkout flow: form, embedded Stripe, webhook, order creation |
| STORE-05 | 03-03 | User receives order confirmation email after payment | SATISFIED | webhook sends OrderConfirmationEmail via Resend |
| STORE-09 | 03-01 | User can select custom color options on eligible products | SATISFIED | ColorSwatches interactive mode in add-to-cart-button.tsx |
| STORE-11 | 03-01 | User can add a gift message at checkout | SATISFIED | gift-message.tsx in cart drawer, persisted in cart store, passed to Stripe metadata |
| STORE-12 | 03-02 | Checkout confirmation mentions handwritten thank-you note | SATISFIED | confirmation/page.tsx renders "Every order includes a handwritten thank-you note" callout |

All 6 requirement IDs accounted for. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| package.json | - | Missing dependencies: zustand, sonner, @stripe/stripe-js, @stripe/react-stripe-js | BLOCKER | App will not build or start. Fresh `npm install` will not install these packages. |
| actions/stripe.ts | 70-78 | Always adds $5 shipping without checking free-shipping threshold | WARNING | Cart drawer shows free shipping over $25 but Stripe charges $5 regardless -- customer sees different totals |
| actions/stripe.ts | 72 | unitPrice fallback "6.00" for missing price in metadata | INFO | Cart metadata may not include price; webhook falls back to hardcoded $6 -- could be wrong for some products |

### Human Verification Required

### 1. End-to-End Purchase Flow
**Test:** Add product to cart, proceed to checkout, fill in customer info, complete Stripe test payment, verify order appears in database
**Expected:** Order created in DB with correct items, customer upserted, charity counter incremented, confirmation email sent
**Why human:** Requires running dev server with STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and Stripe CLI for local webhook forwarding

### 2. Cart Persistence
**Test:** Add items to cart, navigate between pages, refresh browser, verify cart contents survive
**Expected:** Same items with quantities and gift message persist across navigation and hard refresh
**Why human:** Requires browser interaction to test localStorage-backed Zustand persist

### 3. Email Template Rendering
**Test:** Trigger a test order and check the received confirmation email
**Expected:** Email renders with order number, item list with prices, shipping address, handwritten note callout, $1 charity donation callout
**Why human:** Requires RESEND_API_KEY and actual email delivery to verify React Email rendering in email clients

### Gaps Summary

**Gap 1 (BLOCKER): Missing npm dependencies.** Four packages are imported throughout the codebase but not listed in package.json: `zustand` (cart state), `sonner` (toast notifications), `@stripe/stripe-js` (client-side Stripe), and `@stripe/react-stripe-js` (Embedded Checkout components). This prevents the app from building after a fresh `npm install`. The fix is straightforward -- add all four to the dependencies section of package.json and run npm install.

**Gap 2 (WARNING): Shipping logic mismatch.** The cart drawer implements a free-shipping-over-$25 threshold, but the Stripe checkout action unconditionally adds a $5 flat-rate shipping line item. A customer ordering $30 worth of products would see "Free" shipping in the cart but be charged $5 at Stripe checkout. Either the threshold logic needs to be mirrored in the Server Action, or the free-shipping display should be removed from the cart drawer.

Both gaps share a root cause: the three plans were executed in waves and the Stripe action (Plan 02) did not account for the free-shipping logic introduced in Plan 01's cart drawer.

---

_Verified: 2026-03-27T23:30:00Z_
_Verifier: Claude (gsd-verifier)_
