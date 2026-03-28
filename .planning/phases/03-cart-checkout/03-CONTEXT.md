# Phase 3: Cart & Checkout - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Purchase flow from product browsing through payment to order confirmation. Users add products to cart, optionally select custom colors and add gift messages, then complete checkout via Stripe Embedded Checkout as guests (no account). After payment, they see a confirmation page and receive an email. Each successful order increments the charity counter by $1.

</domain>

<decisions>
## Implementation Decisions

### Cart Behavior
- **D-01:** Slide-out cart drawer (reuses shadcn Sheet component from mobile nav) — appears from right when "Add to Cart" is tapped. User stays on the current page.
- **D-02:** Quantity controls: +/- buttons with trash icon to remove. Min quantity 1, no max.
- **D-03:** Cart state managed with Zustand, persisted to localStorage (survives page refresh and navigation).
- **D-04:** Cart icon in header shows item count badge when cart has items.

### Checkout Flow
- **D-05:** Single-page checkout with Stripe Embedded Checkout (not redirect). Customer stays on beadsandbloom.com domain for trust.
- **D-06:** Required fields before Stripe: customer name, email, shipping address (street, city, state, zip). Phone optional.
- **D-07:** Flat-rate $5 shipping shown in order summary. No shipping calculation needed.
- **D-08:** Guest checkout only — no account creation, no login.
- **D-09:** Use Next.js Server Actions (not API routes) for Stripe checkout session creation.

### Custom Color Selection
- **D-10:** On product detail page, if product.customizable is true, show clickable color swatches. User selects colors before adding to cart. Selected colors stored in cart item.
- **D-11:** If product is not customizable, show color info as display-only (no selection needed).

### Order Confirmation
- **D-12:** After Stripe payment succeeds, redirect to /order/confirmation?session_id={id} page showing order summary, estimated delivery, and charity donation mention.
- **D-13:** Confirmation page copy: "Thank you! Your order is on its way." + "Every order includes a handwritten thank-you note." + "$1 from your purchase is being donated to The Storehouse."
- **D-14:** Order confirmation email via Resend with: order number, items purchased, shipping address, estimated delivery, charity donation mention, thank-you note mention.

### Gift Message
- **D-15:** Optional text field in cart drawer labeled "Add a gift message (optional)". 150 character limit.
- **D-16:** Gift message stored with the order and visible in admin dashboard (Phase 4).

### Webhook & Data
- **D-17:** Stripe webhook at /api/webhook handles checkout.session.completed event. Creates order in database, creates customer record (or updates existing by email), increments charity counter by $1.
- **D-18:** Webhook must be idempotent — check if order already exists for the Stripe session before creating.

### Claude's Discretion
- Loading states during checkout (skeleton, spinner, or progress bar)
- Error handling UX (toast notifications vs inline errors)
- Cart empty state messaging
- Stripe webhook retry handling approach

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Tech Stack
- `CLAUDE.md` §Technology Stack — Stripe, Zustand, Resend, React Email specs and version constraints
- `CLAUDE.md` §Stack Patterns — Embedded Checkout pattern, Server Actions for session creation, cart persistence

### Database Schema
- `projects/briefs/beads-and-bloom-website/src/db/schema.ts` — orders, order_items, customers, charity_totals tables
- `projects/briefs/beads-and-bloom-website/src/db/relations.ts` — table relationships
- `projects/briefs/beads-and-bloom-website/src/types/index.ts` — TypeScript types for all entities

### Existing Code
- `projects/briefs/beads-and-bloom-website/src/lib/queries.ts` — existing Drizzle query functions
- `projects/briefs/beads-and-bloom-website/src/app/products/[slug]/page.tsx` — product detail page with Add to Cart button to wire up
- `projects/briefs/beads-and-bloom-website/src/components/ui/sheet.tsx` — shadcn Sheet component for cart drawer

### Prior Phase Context
- `.planning/phases/02-storefront-brand/02-CONTEXT.md` — Phase 2 design decisions
- `.planning/phases/02-storefront-brand/02-UI-SPEC.md` — UI design contract (colors, typography, spacing)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- shadcn Sheet component — reuse for cart drawer (same pattern as mobile nav)
- shadcn Card, Badge, Separator — for order summary display
- Product type with customizable flag and colors array — cart needs these
- Drizzle query layer — extend with order creation functions
- Brand color palette and typography — consistent styling

### Established Patterns
- Server Components for data fetching (product pages)
- Client Components for interactivity (category tabs, photo carousel)
- CSS scroll-snap for touch interactions
- CldImage for Cloudinary-hosted product images
- `node node_modules/...` pattern for running binaries (Windows path workaround)

### Integration Points
- Product detail page "Add to Cart" button — wire up with Zustand cart action
- Header — add cart icon with item count badge
- Homepage — charity counter reads from DB (webhook increments it)
- Layout — cart drawer wraps at layout level for global access

</code_context>

<specifics>
## Specific Ideas

- All products are $6.00 (uniform pricing)
- Charity partner is The Storehouse Community Center (thestorehousecc.org)
- $1 per order donated (not per item)
- Founders are 13-year-old twins — confirmation email tone should be warm and personal
- "Every order includes a handwritten thank-you note" is a key brand differentiator

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-cart-checkout*
*Context gathered: 2026-03-28*
