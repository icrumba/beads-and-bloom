# Project Research Summary

**Project:** Beads & Bloom E-Commerce Website
**Domain:** Small-batch handmade jewelry e-commerce (teen-founded, charity-integrated, Instagram-driven)
**Researched:** 2026-03-27
**Confidence:** HIGH

## Executive Summary

Beads & Bloom is a custom e-commerce site for a teen-founded handmade jewelry brand. The proven approach for this type of project is a Next.js 15 full-stack application with Server Components for the product catalog, Stripe Embedded Checkout for payments, and a simple admin dashboard for order fulfillment. The stack is well-established: Neon Postgres with Drizzle ORM for data, Cloudinary for image optimization, Resend for email, and Vercel Pro for hosting. Total monthly cost at launch is approximately $21-22/month. Every technology choice has high community confidence and official documentation.

The recommended build strategy follows the dependency chain: database schema first, then storefront (browse and buy), then admin dashboard (manage orders), then polish. The storefront must be live before the admin matters -- customers generate the orders that the dashboard manages. Custom color requests and multi-channel notifications are differentiators but should come after basic ordering works end-to-end. The architecture separates public storefront and admin into route groups sharing the same data layer, with Server Actions for mutations and a single webhook route handler for Stripe events.

The top risks are Stripe webhook unreliability (lost orders), notification failures (missed orders), and product images killing mobile performance. All three are preventable with established patterns: idempotent webhook handling, multi-channel notification redundancy with the dashboard as source of truth, and Cloudinary image optimization from day one. The admin dashboard must be designed for teen usability -- a to-do list, not a database viewer -- and tested with the actual founders on their phones.

## Key Findings

### Recommended Stack

The stack centers on Next.js 15 with the App Router, chosen for Server Components (zero client JS for product browsing), Server Actions (clean Stripe integration), and the strongest ecosystem support in 2026. Drizzle ORM over Prisma eliminates cold-start penalties on serverless and removes the code generation step. Neon Postgres provides serverless Postgres with a generous free tier that scales to zero when idle.

**Core technologies:**
- **Next.js 15 + React 19:** Full-stack framework with Server Components for fast mobile page loads from Instagram
- **Neon Postgres + Drizzle ORM:** Serverless database with lightweight, edge-compatible ORM -- no cold starts
- **Stripe Embedded Checkout:** PCI-compliant payment processing that keeps customers on the Beads & Bloom domain
- **Cloudinary:** Automatic image optimization (WebP/AVIF, responsive transforms) critical for mobile-first jewelry browsing
- **Tailwind CSS 4 + shadcn/ui:** Rapid UI development with accessible, customizable components
- **Resend + React Email:** Transactional email with React-based templates for order confirmations
- **Zustand:** Lightweight (1kb) client-side cart state persisted to localStorage
- **Vercel Pro ($20/mo):** Required for commercial use -- best Next.js hosting with git-push deploys

### Expected Features

**Must have (table stakes):**
- Mobile-responsive product catalog with detail pages (materials, sizing, care info)
- Cart + Stripe guest checkout (no accounts, no login)
- Order confirmation email
- Shipping info page (flat-rate) + return policy
- About page / founder story (primary trust builder for handmade)
- Basic SEO metadata

**Should have (differentiators):**
- Live charity donation counter ("$X donated to [charity]") -- core brand identity
- Custom color request flow on eligible products -- moves from "buy" to "co-create"
- Fulfillment status tracking (New > Making > Shipped > Delivered) -- professional-grade for teen founders
- Multi-channel order notifications (email + SMS + dashboard)
- Made-to-order vs ready-to-ship distinction on product pages
- Founder-friendly admin dashboard (mobile-first, plain language, big tap targets)

**Defer (v2+):**
- Instagram feed embed (not revenue-driving)
- Discount/coupon codes (Stripe supports natively -- easy to add later)
- Customer accounts/login (COPPA concerns, guest checkout converts better)
- Newsletter/email marketing (founders won't sustain content creation)
- Inventory management (manual toggle is fine at this volume)

### Architecture Approach

The application is a single Next.js deployment with two route groups: `(shop)` for the public storefront and `(admin)` for the protected dashboard. Both share the same database and Server Actions layer. External integrations (Stripe, Resend, Twilio, Cloudinary) are each encapsulated in a single file under `lib/`. The only API route handler is for the Stripe webhook -- everything else uses Server Actions for mutations and Server Components for reads.

**Major components:**
1. **Product Catalog (public)** -- Server Components with static generation, Cloudinary image optimization, product detail pages with custom color picker
2. **Cart + Checkout** -- Client-side Zustand cart, Server Action creates Stripe Checkout Session, webhook creates orders
3. **Admin Dashboard (protected)** -- Order Kanban board, product CRUD, notification center, simple password auth
4. **Notification Service** -- Webhook-triggered parallel email (Resend) + SMS (Twilio), with dashboard as source of truth
5. **Charity Counter** -- Server Component reading aggregate donation total from database, increments per order

### Critical Pitfalls

1. **Stripe webhook unreliability (lost orders)** -- Implement idempotent webhook handling: verify signatures with raw body, store processed event IDs to skip duplicates, use `checkout.session.completed` not `payment_intent.succeeded`, return 200 immediately. Build a daily reconciliation check against Stripe dashboard.
2. **Notification failures (missed orders)** -- The admin dashboard is the source of truth, not notifications. Send both email AND SMS. Log delivery status. Consider an "unacknowledged order" re-alert after 2 hours.
3. **Product images killing mobile performance** -- Use Cloudinary from day one with auto-resize, WebP/AVIF conversion, and consistent 1:1 aspect ratios. Set 2MB upload limit. Target Lighthouse mobile score above 80.
4. **Custom orders without a structured workflow** -- Model as a distinct order type with a "Confirmed" step before fulfillment. Offer structured color dropdowns, not free-text. Set timeline expectations on product pages.
5. **Admin dashboard too complex for teens** -- Design as a to-do list, not a database viewer. Plain language statuses, one-tap actions, mobile-first layout. Test with the actual founders during development.
6. **Shipping/tax misconfiguration** -- Use Stripe Tax from day one. Make shipping rate configurable, not hardcoded. Display total (product + shipping + tax) before payment.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation -- Database Schema + Project Scaffold
**Rationale:** Everything depends on the data model. The schema must account for custom orders (distinct status flow) and the charity counter from the start -- retrofitting these is painful.
**Delivers:** Next.js project scaffold, Drizzle schema with migrations, seed data with real products, Cloudinary integration for image uploads, development environment setup.
**Addresses:** Data model for products, orders, customers, order items, charity total
**Avoids:** Pitfall 4 (custom orders without workflow) by designing the schema correctly upfront

### Phase 2: Storefront -- Browse and Buy
**Rationale:** Customers must be able to browse and purchase before any admin functionality matters. This is the critical path to revenue.
**Delivers:** Mobile-responsive product catalog, product detail pages, cart (Zustand + localStorage), Stripe Embedded Checkout, order confirmation page, webhook-driven order creation, charity counter on homepage.
**Addresses:** All table stakes features -- catalog, cart, checkout, confirmation, about page, shipping/return policies, SEO
**Avoids:** Pitfall 1 (webhook unreliability) with idempotent handler; Pitfall 3 (image performance) with Cloudinary pipeline; Pitfall 6 (tax misconfiguration) with Stripe Tax

### Phase 3: Admin Dashboard -- Manage Orders and Products
**Rationale:** Once orders exist in the database, founders need to manage them. The admin is a parallel track that reads/writes the same data as the storefront.
**Delivers:** Password-protected admin area, order Kanban board (New > Making > Shipped > Delivered), product CRUD with image upload, customer list, dashboard overview with stats.
**Addresses:** Fulfillment tracking, product management, founder-friendly admin UX
**Avoids:** Pitfall 5 (admin too complex) by designing for teen usability from the start; Pitfall 2 (notification SPOF) by making the dashboard the source of truth

### Phase 4: Notifications + Custom Orders
**Rationale:** Multi-channel notifications and custom color requests are differentiators that build on top of working checkout and admin. They add complexity to the order lifecycle and should come after the core flow is solid.
**Delivers:** Email notifications via Resend (order confirmation to customer, new order alert to founders), SMS via Twilio, custom color request form on eligible products, made-to-order vs ready-to-ship display, shipping confirmation email on status change.
**Addresses:** Multi-channel notifications, custom color requests, made-to-order distinction
**Avoids:** Pitfall 2 (notification SPOF) with redundant channels + dashboard fallback; Pitfall 4 (custom order chaos) with structured workflow

### Phase 5: Polish + Launch Prep
**Rationale:** Final pass on mobile performance, error handling, and edge cases before going live. This is where the "looks done but isn't" checklist gets validated.
**Delivers:** Lighthouse mobile score 90+, error state handling (Stripe down, SMS failed), loading states, real-device testing on iPhone/Android, Stripe test card scenarios (declined, 3D Secure), DNS setup for email deliverability (SPF/DKIM/DMARC), production deployment.
**Addresses:** Mobile optimization, error resilience, production readiness
**Avoids:** All remaining items on the "looks done but isn't" checklist from PITFALLS.md

### Phase Ordering Rationale

- **Schema before everything** because both storefront and admin depend on the data model, and custom order workflow must be designed into the schema from day one (Pitfall 4)
- **Storefront before admin** because the admin manages orders that don't exist until customers can buy -- and revenue generation is the goal
- **Admin before notifications** because the dashboard is the source of truth for orders (Pitfall 2), and notifications are a convenience layer on top
- **Custom orders bundled with notifications** because both extend the order lifecycle and depend on the core purchase flow working
- **Polish last** because performance optimization and error handling are most effective when all features are integrated

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Storefront):** Stripe Embedded Checkout integration with Server Actions needs careful implementation -- webhook idempotency and Stripe Tax configuration are integration-heavy
- **Phase 4 (Notifications):** Twilio A2P 10DLC registration and Resend DNS authentication (SPF/DKIM/DMARC) have compliance requirements that need step-by-step guidance

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Standard Next.js + Drizzle scaffold with well-documented setup
- **Phase 3 (Admin):** shadcn/ui data tables, simple password auth, CRUD forms -- all heavily documented patterns
- **Phase 5 (Polish):** Lighthouse optimization and testing are standard practice with clear benchmarks

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies have official docs, active maintenance, and wide adoption. Next.js 15 + Drizzle + Neon is a well-tested serverless stack. |
| Features | HIGH | Feature landscape validated against real handmade jewelry stores (ROOTSSEA, WATERSANDSTONE) and e-commerce best practices. Clear table stakes vs differentiators. |
| Architecture | HIGH | Server Components + Server Actions + webhook pattern is the standard Next.js e-commerce approach in 2026. One minor inconsistency: ARCHITECTURE.md references SQLite/Prisma in some places while STACK.md recommends Neon Postgres/Drizzle -- use the STACK.md recommendation. |
| Pitfalls | HIGH | Stripe webhook pitfalls are extremely well-documented. UX pitfalls validated by e-commerce industry data (cart abandonment rates, mobile conversion research). |

**Overall confidence:** HIGH

### Gaps to Address

- **Architecture/Stack inconsistency:** ARCHITECTURE.md references SQLite and Prisma in diagrams and code examples, but STACK.md recommends Neon Postgres and Drizzle ORM. The stack recommendation is correct -- implementation should follow STACK.md. Architecture patterns (Server Actions, webhook handling, route groups) remain valid regardless of ORM choice.
- **Twilio A2P 10DLC registration:** Research flags this as required to avoid SMS filtering, but no step-by-step guide was found. Research this during Phase 4 planning.
- **Stripe Tax configuration:** Mentioned as "use from day one" but exact setup steps for domestic-only jewelry sales need validation during Phase 2 implementation.
- **Netlify fallback:** If $20/month Vercel Pro is a concern for teen founders, Netlify free tier is a viable alternative. Decision should be made before Phase 1 scaffolding.
- **Hosting decision affects architecture:** If Netlify is chosen over Vercel, some edge middleware patterns (admin auth) may need adjustment. Decide hosting before implementation begins.

## Sources

### Primary (HIGH confidence)
- [Next.js App Router Documentation](https://nextjs.org/docs/app) -- framework patterns, Server Components, Server Actions
- [Stripe Checkout Quickstart for Next.js](https://docs.stripe.com/checkout/quickstart?client=next) -- Embedded Checkout integration
- [Stripe Webhooks Documentation](https://docs.stripe.com/webhooks) -- webhook handling patterns
- [Neon Postgres Pricing](https://neon.com/pricing) -- free tier verification
- [Drizzle ORM PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql) -- Neon driver setup
- [shadcn/ui CLI v4 Changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- component library setup
- [Resend Next.js Integration](https://resend.com/docs/send-with-nextjs) -- email notification setup
- [Cloudinary Next.js Integration](https://github.com/cloudinary-community/next-cloudinary) -- image optimization

### Secondary (MEDIUM confidence)
- [Stripe + Next.js 15 Complete Guide](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/) -- Server Actions pattern for checkout
- [Drizzle vs Prisma 2026 Comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma) -- ORM performance analysis
- [Your Next Store Reference Architecture](https://github.com/yournextstore/yournextstore) -- Next.js e-commerce patterns
- [Stripe Webhook Best Practices](https://www.stigg.io/blog-posts/best-practices-i-wish-we-knew-when-integrating-stripe-webhooks) -- idempotency patterns
- [Omnisend Jewelry E-commerce Guide](https://www.omnisend.com/blog/jewelry-ecommerce/) -- feature expectations
- Real store references: [ROOTSSEA](https://rootssea.com/), [WATERSANDSTONE](https://watersandstone.com/) -- feature validation

### Tertiary (LOW confidence)
- [next-cloudinary version compatibility](https://github.com/cloudinary-community/next-cloudinary) -- v6.x with Next.js 15 needs verification during setup

---
*Research completed: 2026-03-27*
*Ready for roadmap: yes*
