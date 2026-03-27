# Architecture Research

**Domain:** Small-batch handmade jewelry e-commerce
**Researched:** 2026-03-27
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER-FACING (Public)                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Product   │  │   Cart    │  │ Checkout  │  │   About /   │  │
│  │  Catalog   │  │  Drawer   │  │  (Stripe) │  │   Charity   │  │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────────────┘  │
│        │              │              │                           │
├────────┴──────────────┴──────────────┴───────────────────────────┤
│                     NEXT.JS APP ROUTER                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Server Components + Server Actions + Route Handlers        │ │
│  └──────────────┬──────────────────────────┬───────────────────┘ │
├─────────────────┴──────────────────────────┴─────────────────────┤
│                     DATA + SERVICES LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  SQLite  │  │  Stripe  │  │  Resend  │  │   Twilio     │    │
│  │  (DB)    │  │ (Pay)    │  │ (Email)  │  │   (SMS)      │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD (Protected)                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Orders   │  │ Products  │  │ Customers │  │  Charity    │  │
│  │  Board    │  │  Manager  │  │   List    │  │  Counter    │  │
│  └───────────┘  └───────────┘  └───────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Product Catalog | Browse products, filter by category, view details, select custom colors | Server Components with static generation, image optimization |
| Cart | Add/remove items, color customization notes, quantity | Client-side state (Zustand or React Context), persisted to localStorage |
| Checkout | Collect shipping info, process payment | Stripe Embedded Checkout or Stripe Checkout Sessions via Server Action |
| Admin Orders Board | View/update order status through fulfillment pipeline | Protected route group, Kanban-style board with drag-and-drop |
| Admin Products Manager | Add/edit/remove products and images | Server Actions for CRUD, image upload to local public/ or cloud storage |
| Admin Customers | View customer history, contact info, custom requests | Read-only list with search, linked to order history |
| Notification Service | Send order alerts to founders via email and SMS | Stripe webhook handler triggers Resend (email) + Twilio (SMS) |
| Charity Counter | Track and display running donation total | Server Component reading aggregate from DB, updates on each order |

## Recommended Project Structure

```
projects/briefs/beads-and-bloom-website/
├── package.json              # Project deps (Next.js, Stripe, Prisma, etc.)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind + custom theme
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data (initial products)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (fonts, metadata, analytics)
│   │   ├── page.tsx          # Homepage (hero, featured products, charity counter)
│   │   ├── (shop)/           # Route group: public storefront
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product listing / catalog
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Product detail + custom color picker
│   │   │   ├── cart/
│   │   │   │   └── page.tsx          # Cart review
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx          # Stripe Embedded Checkout
│   │   │   │   └── success/
│   │   │   │       └── page.tsx      # Order confirmation
│   │   │   └── about/
│   │   │       └── page.tsx          # Founder story + charity info
│   │   ├── (admin)/          # Route group: protected admin area
│   │   │   ├── layout.tsx            # Admin shell (sidebar nav, auth check)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Overview: recent orders, stats, charity total
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx          # Kanban board (New → Making → Shipped → Delivered)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Order detail + status update
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Product list with add/edit/toggle
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Product edit form
│   │   │   └── customers/
│   │   │       └── page.tsx          # Customer list with order history
│   │   └── api/
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts      # Stripe webhook handler (raw body)
│   ├── components/
│   │   ├── ui/               # Shadcn UI primitives (button, card, dialog, etc.)
│   │   ├── shop/             # Storefront components (ProductCard, CartDrawer, etc.)
│   │   ├── admin/            # Admin components (OrderKanban, StatusBadge, etc.)
│   │   └── shared/           # Cross-cutting (Header, Footer, CharityCounter)
│   ├── lib/
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── stripe.ts         # Stripe client + helpers
│   │   ├── notifications.ts  # Email (Resend) + SMS (Twilio) send functions
│   │   ├── auth.ts           # Simple admin auth (password or magic link)
│   │   └── utils.ts          # Formatting, constants
│   ├── actions/
│   │   ├── orders.ts         # Server Actions: updateOrderStatus, getOrders
│   │   ├── products.ts       # Server Actions: createProduct, updateProduct
│   │   ├── checkout.ts       # Server Actions: createCheckoutSession
│   │   └── customers.ts      # Server Actions: getCustomers, getCustomerOrders
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── public/
│   ├── images/               # Product photos
│   └── fonts/                # Custom fonts if needed
└── .env.local                # API keys (gitignored)
```

### Structure Rationale

- **Route groups `(shop)` and `(admin)`:** Separate public and admin layouts without affecting URLs. `/products` is public, `/dashboard` is admin. Each gets its own layout with different nav, styling, and auth requirements.
- **`actions/` directory:** Server Actions colocated by domain (orders, products, checkout). Avoids the old API routes pattern for internal mutations. Only the Stripe webhook uses a route handler because Stripe sends external HTTP requests.
- **`lib/` directory:** Service clients and utilities. Each external service (Stripe, Resend, Twilio, Prisma) gets one file with its client initialization and helper functions.
- **`components/` split by context:** `shop/` components never import `admin/` components and vice versa. `shared/` holds the few pieces used by both (header, footer, charity counter). `ui/` is the Shadcn primitive layer.

## Architectural Patterns

### Pattern 1: Server Actions for Mutations

**What:** Use Next.js Server Actions instead of API routes for all internal data mutations (order status updates, product CRUD, cart operations).
**When to use:** Any form submission or data mutation triggered by the app itself.
**Trade-offs:** Simpler code, automatic CSRF protection, smaller client bundle. But cannot be called from external systems (use route handlers for webhooks).

**Example:**
```typescript
// src/actions/orders.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendOrderNotification } from "@/lib/notifications";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await db.order.update({
    where: { id: orderId },
    data: { status, updatedAt: new Date() },
  });

  if (status === "shipped") {
    await sendOrderNotification(order, "shipped");
  }

  revalidatePath("/dashboard/orders");
  return order;
}
```

### Pattern 2: Webhook-Driven Order Creation

**What:** Orders are created in the database only after Stripe confirms payment via webhook, not when the customer clicks "pay." The webhook handler is the single source of truth for successful payments.
**When to use:** Always. Never create orders optimistically before payment confirmation.
**Trade-offs:** Slight delay between payment and order appearing in admin (typically <5 seconds). But guarantees no phantom orders from failed payments.

**Example:**
```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendOrderNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const body = await req.text(); // Raw body for signature verification
  const signature = req.headers.get("stripe-signature")!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = await db.order.create({
      data: {
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email!,
        customerName: session.customer_details?.name!,
        amount: session.amount_total!,
        status: "new",
        // Parse line items from session metadata
      },
    });
    // Fire notifications in parallel
    await sendOrderNotification(order, "new");
  }

  return NextResponse.json({ received: true });
}
```

### Pattern 3: Simple Password Auth for Admin

**What:** Protect admin routes with a single shared password (or magic link to the founders' email), not a full user account system. Store a hashed password in env vars. Use an HTTP-only cookie for the session.
**When to use:** When there are 1-2 known admin users and no need for role-based access.
**Trade-offs:** Dead simple to implement and understand. No user management overhead. But does not scale to multiple roles or team members (fine for two teen founders).

## Data Flow

### Customer Purchase Flow

```
Customer browses products (Server Components, static/ISR)
    ↓
Adds to cart (Client state, localStorage)
    ↓
Proceeds to checkout (Server Action: createCheckoutSession)
    ↓
Stripe Embedded Checkout collects payment + shipping info
    ↓
Payment succeeds → Stripe fires webhook
    ↓
Webhook handler (route.ts):
    ├── Creates order in SQLite (status: "new")
    ├── Creates/updates customer record
    ├── Increments charity counter (+$1)
    ├── Sends email notification to founders (Resend)
    └── Sends SMS notification to founders (Twilio)
    ↓
Founders see order in admin dashboard
    ↓
Founders update status: New → Making → Shipped → Delivered
    ↓
Status change to "shipped" triggers customer email with tracking info
```

### Admin Order Management Flow

```
Founder opens /dashboard/orders
    ↓
Server Component fetches orders grouped by status
    ↓
Kanban board renders: New | Making | Shipped | Delivered
    ↓
Founder drags order or clicks status button
    ↓
Server Action: updateOrderStatus(orderId, newStatus)
    ↓
Database updated, path revalidated
    ↓
If status === "shipped" → customer notification with tracking
```

### Key Data Flows

1. **Product display:** Prisma query (server) → Server Component render → Static HTML (cached/ISR). Products change rarely, so aggressive caching works.
2. **Cart:** Client-only state in Zustand/Context → localStorage persistence. No server round-trips until checkout. Cart is ephemeral -- if it's lost, customer re-adds items (acceptable for small catalog).
3. **Checkout:** Server Action creates Stripe Checkout Session with line items + metadata → Stripe handles payment UI → webhook confirms → order created server-side.
4. **Notifications:** Webhook handler fires email (Resend) and SMS (Twilio) in parallel using Promise.all. Both are fire-and-forget with error logging -- a failed SMS should never block order creation.
5. **Admin auth:** Password check → set HTTP-only cookie → middleware checks cookie on every `(admin)` route.

## Data Model

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Product    │     │      Order       │     │   Customer    │
├─────────────┤     ├──────────────────┤     ├───────────────┤
│ id           │     │ id               │     │ id            │
│ name         │     │ stripeSessionId  │     │ email         │
│ slug         │     │ customerId    ──────→  │ name          │
│ description  │     │ status           │     │ phone         │
│ price        │     │ totalAmount      │     │ address       │
│ category     │     │ shippingAddress  │     │ createdAt     │
│ images[]     │     │ notes            │     │ orderCount    │
│ colors[]     │     │ createdAt        │     └───────────────┘
│ customizable │     │ updatedAt        │
│ inStock      │     └──────────────────┘
│ featured     │              │
│ sortOrder    │     ┌──────────────────┐
└─────────────┘     │    OrderItem     │
       ↑            ├──────────────────┤
       │            │ id               │
       └────────────│ productId     ──→│
                    │ orderId       ──→│
                    │ quantity         │
                    │ customColors     │
                    │ unitPrice        │
                    └──────────────────┘

┌──────────────────┐
│  CharityTotal    │
├──────────────────┤
│ id               │
│ totalDonated     │
│ orderCount       │
│ lastUpdated      │
└──────────────────┘
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-100 orders/month (current) | SQLite on disk, single Vercel deployment, no caching layer needed. This is the target. |
| 100-1,000 orders/month | Move SQLite to Turso (distributed SQLite) or migrate to Postgres on Supabase/Neon. Add image CDN if not using Vercel Image Optimization. |
| 1,000+ orders/month | At this point they have a real business and should consider Shopify or a managed commerce platform. The custom site served its purpose. |

### Scaling Priorities

1. **First bottleneck: Image loading.** Product photos are the heaviest assets. Use Next.js Image component with proper sizing from day one. This is free performance.
2. **Second bottleneck: Database on serverless.** SQLite works great on a single server but needs Turso or a hosted DB if deploying to serverless (Vercel). Prisma with SQLite works locally and in preview; switch the connection string for production if needed.

## Anti-Patterns

### Anti-Pattern 1: Building a Full CMS

**What people do:** Set up a headless CMS (Sanity, Contentful) for product management.
**Why it's wrong:** Massive overkill for 20-50 products. Adds an external dependency, a separate login, and complexity for teen founders who just need to add a bracelet with a photo and price.
**Do this instead:** Build a simple admin form that writes directly to the database. One page, one form. The product catalog is small enough that a database-backed admin is simpler and faster than any CMS.

### Anti-Pattern 2: Client-Side Data Fetching for Products

**What people do:** Use useEffect + fetch to load products on the client, showing loading spinners.
**Why it's wrong:** Products are public, rarely change, and need to be SEO-indexed. Client fetching means no SSR, no caching, worse Core Web Vitals, and no social media previews.
**Do this instead:** Server Components with static generation or ISR. Products render as HTML on first load. Zero client-side JavaScript for the catalog pages.

### Anti-Pattern 3: Optimistic Order Creation

**What people do:** Create the order in the database when checkout starts, then update it when payment succeeds.
**Why it's wrong:** Creates phantom orders from abandoned checkouts, failed payments, and expired sessions. Founders see "orders" that never paid.
**Do this instead:** Create orders only in the Stripe webhook handler after payment confirmation. The webhook is the single source of truth.

### Anti-Pattern 4: Storing Cart Server-Side

**What people do:** Build a server-side cart with database persistence, session management, and cart expiry logic.
**Why it's wrong:** Guest checkout + small catalog + low traffic = all that server infrastructure for a cart that holds 1-3 items. Adds latency to every "add to cart" click.
**Do this instead:** Client-side cart in localStorage (or Zustand with persistence). Serialize cart items into Stripe Checkout Session metadata at checkout time. If the tab closes, the cart may be lost -- that's fine at this scale.

### Anti-Pattern 5: Over-Engineering Admin Auth

**What people do:** Implement NextAuth with OAuth providers, user roles, session management, password reset flows.
**Why it's wrong:** Two known users (the twins) on one shared device. Full auth is complexity with zero benefit.
**Do this instead:** Single password stored as a bcrypt hash in env vars. HTTP-only cookie. Middleware check on `(admin)` routes. Done in 50 lines. Upgrade to NextAuth later if they ever need multiple admin users.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Stripe | Server Action creates Checkout Session; webhook route handler receives events | Use Stripe Embedded Checkout to keep customers on-site. Verify webhook signatures with raw body (not parsed JSON). |
| Resend | Called from webhook handler and order status update actions | Free tier: 100 emails/day (more than enough). Use React Email for branded templates. |
| Twilio | Called from webhook handler for new order SMS to founders | Free trial gives credits. Only sends to verified numbers (founders' phones). Production: ~$0.01/SMS. |
| Vercel | Deployment platform | Free hobby tier works. Serverless functions for API routes and Server Actions. Edge middleware for admin auth. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Shop pages ↔ Database | Server Components + Server Actions via Prisma | No client-side data fetching for products. Cart is client-only. |
| Checkout ↔ Stripe | Server Action creates session, redirect/embed handles payment | Never touch card data. Stripe handles PCI compliance entirely. |
| Stripe ↔ Notification layer | Webhook POST → route handler → parallel email + SMS | Decouple notification from order creation. Log failures, don't retry inline. |
| Admin ↔ Database | Server Actions for all mutations, Server Components for reads | Protected by middleware auth check. Revalidate paths after mutations. |
| Cart (client) ↔ Checkout (server) | Cart state serialized into createCheckoutSession Server Action params | Cart items are just product IDs + quantities + color choices. Validated server-side before creating Stripe session. |

## Suggested Build Order

Based on component dependencies, build in this sequence:

1. **Database schema + product seed data** -- Everything depends on this. Define the Prisma schema, run migrations, seed with real products.
2. **Product catalog (public)** -- Server Components, product listing and detail pages. The visual core of the site. No external service dependencies.
3. **Cart** -- Client-side state management. Depends on product data structure being stable.
4. **Stripe checkout + webhook + order creation** -- The critical payment flow. Depends on schema (orders table) and product data. This is the most integration-heavy piece.
5. **Notification layer (email + SMS)** -- Plugs into the webhook handler. Can be added after checkout works. Resend + Twilio integrations.
6. **Admin dashboard + auth** -- Depends on orders and products existing in the DB. Build after the purchase flow works end-to-end so there are real orders to manage.
7. **Charity counter + about page** -- Low dependency, high brand value. Can slot in anytime after the DB schema includes the charity total.
8. **Polish: mobile optimization, loading states, error handling** -- Final pass after all features work.

**Dependency chain:** Schema → Catalog → Cart → Checkout/Webhook → Notifications → Admin → Polish

## Sources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Stripe Embedded Checkout Documentation](https://docs.stripe.com/checkout/embedded/quickstart)
- [Stripe Webhooks Documentation](https://docs.stripe.com/webhooks)
- [Your Next Store - Reference Architecture](https://github.com/yournextstore/yournextstore)
- [Next.js Project Structure Guide (MakerKit)](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
- [Next.js E-commerce Best Practices (DEV Community)](https://dev.to/sameer_saleem/the-ultimate-guide-to-stripe-nextjs-2026-edition-2f33)
- [Resend Email + Stripe Webhooks Guide](https://www.sequenzy.com/blog/send-emails-stripe)

---
*Architecture research for: Beads & Bloom handmade jewelry e-commerce*
*Researched: 2026-03-27*
