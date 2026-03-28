# Phase 4: Admin & Order Management - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Founder-facing admin dashboard at /admin/* for managing orders, products, and customers. Plus a public order tracking page at /track for customers to check status. Admin must be mobile-friendly and simple enough for 13-year-old founders.

</domain>

<decisions>
## Implementation Decisions

### Admin Authentication
- **D-01:** Simple middleware-based password protection. Single shared password stored in env var (ADMIN_PASSWORD). Middleware checks for a session cookie — if missing or invalid, redirects to /admin/login.
- **D-02:** Login page is a simple password field + submit button. On correct password, sets httpOnly session cookie. No user accounts, no NextAuth.
- **D-03:** Session cookie expires after 7 days. No "remember me" option needed — just re-enter the password.

### Order Management
- **D-04:** Order list at /admin/orders using @tanstack/react-table with shadcn data-table pattern. Columns: order number, customer name, date, total, status badge, actions.
- **D-05:** Status badges use colors: New (blue), Making (amber), Shipped (purple), Delivered (green).
- **D-06:** One-tap status advance: each order row has a "Next Status" button that moves to the next stage (New → Making → Shipped → Delivered). No dropdown — just one tap forward.
- **D-07:** Order detail page at /admin/orders/[id] shows full order info: items with colors, customer contact, shipping address, gift message, payment details.
- **D-08:** Filter orders by status tab (All, New, Making, Shipped, Delivered). Search by customer name or order number.
- **D-09:** Toast notification (sonner) on status update confirmation.

### Product Management
- **D-10:** Product list at /admin/products with add/edit/remove capabilities.
- **D-11:** Product form at /admin/products/new and /admin/products/[id]/edit with fields matching the schema: name, slug (auto-generated from name), description, price, category (dropdown), availability (dropdown), images, colors, materials, care info, featured toggle, in-stock toggle.
- **D-12:** Image upload uses Cloudinary upload widget (CldUploadWidget from next-cloudinary). Drag and drop or click to upload. Returns public ID stored in product.images array.
- **D-13:** Delete product requires confirmation dialog ("Are you sure? This cannot be undone.").

### New Order Email Notification
- **D-14:** When webhook processes a new order, send a notification email to the founders' email address (stored in ADMIN_EMAIL env var).
- **D-15:** Admin notification email: subject "New Order #{orderNumber}", body includes customer name, items ordered, total, shipping address. Simple, scannable format — founders check this on their phones.
- **D-16:** Triggered in the same webhook handler as the customer confirmation email (Phase 3). Two emails sent: one to customer, one to admin.

### Customer Order Tracking
- **D-17:** Public page at /track (no login required). Customer enters order number + email.
- **D-18:** If found, shows: order status with visual progress bar (New → Making → Shipped → Delivered), ordered items, estimated delivery based on status, and order date.
- **D-19:** If not found, shows friendly message: "We couldn't find that order. Double-check your order number and email."

### Claude's Discretion
- Admin dashboard layout (sidebar vs top nav)
- Table pagination (client-side is fine for low volume)
- Product form validation details
- Loading and error states in admin

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Database Schema
- `projects/briefs/beads-and-bloom-website/src/db/schema.ts` — orders, order_items, customers, products tables with status enum
- `projects/briefs/beads-and-bloom-website/src/db/relations.ts` — table relationships
- `projects/briefs/beads-and-bloom-website/src/types/index.ts` — TypeScript types

### Existing Code
- `projects/briefs/beads-and-bloom-website/src/lib/queries.ts` — existing query functions to extend
- `projects/briefs/beads-and-bloom-website/src/app/api/webhook/route.ts` — webhook to add admin notification
- `projects/briefs/beads-and-bloom-website/src/emails/order-confirmation.tsx` — email template pattern to follow

### Tech Stack
- `CLAUDE.md` §Technology Stack — @tanstack/react-table, shadcn/ui, next-cloudinary, sonner, Resend

### Prior Phase Context
- `.planning/phases/03-cart-checkout/03-CONTEXT.md` — checkout decisions
- `.planning/phases/02-storefront-brand/02-UI-SPEC.md` — design system (colors, typography)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- shadcn components: Card, Badge, Tabs, Sheet, Separator, Skeleton, Button
- sonner for toast notifications (already installed)
- Resend email sending pattern from webhook
- React Email template pattern from order-confirmation.tsx
- CldImage and CldUploadWidget from next-cloudinary
- Drizzle query pattern from queries.ts

### Established Patterns
- Server Components for data fetching, Client Components for interactivity
- Server Actions for mutations (pattern from Stripe checkout)
- Zod validation for form data (pattern from checkout form)
- `node node_modules/...` for running binaries (Windows workaround)

### Integration Points
- Webhook handler — add admin notification email alongside customer email
- queries.ts — add order management, product CRUD, customer lookup functions
- middleware.ts — new file for admin auth

</code_context>

<specifics>
## Specific Ideas

- Founders are 13 — admin must feel like a simple app, not enterprise software
- Most admin usage will be on phones (checking orders between school and crafting)
- Low order volume (5-10/day max) — no need for complex pagination or real-time updates
- Order status flow: New → Making → Shipped → Delivered (one direction only, no going back)
- The admin notification email is the "never miss an order" safety net

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-admin-order-management*
*Context gathered: 2026-03-28*
