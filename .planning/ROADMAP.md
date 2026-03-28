# Roadmap: Beads & Bloom E-Commerce Website

## Overview

This roadmap delivers a mobile-first e-commerce website for Beads & Bloom in five phases. We start with the data foundation and project scaffold, then build the public storefront customers will browse, followed by the Stripe-powered purchase flow, then the admin dashboard founders use to manage orders and products, and finally polish everything for production launch. Each phase delivers a coherent, testable capability that builds on the previous one.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Database schema, project scaffold, and development environment
- [ ] **Phase 2: Storefront & Brand** - Product catalog, brand pages, and content that customers browse
- [ ] **Phase 3: Cart & Checkout** - Purchase flow from cart through Stripe payment to confirmation
- [ ] **Phase 4: Admin & Order Management** - Founder dashboard for orders, products, customers, and tracking
- [ ] **Phase 5: Polish & Launch** - Performance optimization, error handling, and production deployment

## Phase Details

### Phase 1: Foundation
**Goal**: A working development environment with the complete data model, so every subsequent phase builds on solid infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: None directly (enables all phases)
**Success Criteria** (what must be TRUE):
  1. Next.js 15 app runs locally with Tailwind CSS 4 and shadcn/ui configured
  2. Drizzle ORM connects to Neon Postgres with all tables migrated (products, orders, order_items, customers, charity_totals)
  3. Seed script populates database with real Beads & Bloom products including photos via Cloudinary
  4. Custom order data model supports distinct status flow (with "Confirmed" step) from day one
  5. Project lives entirely inside projects/briefs/beads-and-bloom-website/ with no files at the agentic-os root
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md -- Scaffold Next.js 15 project with Tailwind, shadcn/ui, Drizzle config, and all Phase 1 dependencies
- [x] 01-02-PLAN.md -- Define complete database schema (5 tables, 2 enums, relations) and push to Neon Postgres
- [x] 01-03-PLAN.md -- Create and run seed script with real Beads & Bloom product data and charity counter

### Phase 2: Storefront & Brand
**Goal**: Customers arriving from Instagram can browse all products and learn about the brand on their phones
**Depends on**: Phase 1
**Requirements**: STORE-01, STORE-02, STORE-06, STORE-07, STORE-08, STORE-10, BRAND-01, BRAND-02, BRAND-03, BRAND-04
**Success Criteria** (what must be TRUE):
  1. User can browse a mobile-responsive product grid and tap into detail pages with photos, description, price, materials, and care info
  2. Product pages display "Ready to ship" or "Made to order (5-7 days)" flags accurately
  3. About page tells the founder story with charity mission, and homepage shows a running charity donation counter
  4. Shipping info page, return policy page, and contact page (email + Instagram DM) are all accessible
  5. Product pages have proper SEO metadata (title tags, descriptions, OG images) for sharing
**Plans**: 3 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md -- Design system (font, colors, shadcn components), shared layout (header, footer, mobile nav), and Drizzle query layer
- [x] 02-02-PLAN.md -- Homepage with hero, category tabs, product grid, and product detail page with photo carousel and SEO
- [x] 02-03-PLAN.md -- Brand pages (about, contact, shipping, returns) and homepage charity counter + Instagram gallery

### Phase 3: Cart & Checkout
**Goal**: Customers can add products to cart and complete a purchase with Stripe -- the path to revenue
**Depends on**: Phase 2
**Requirements**: STORE-03, STORE-04, STORE-05, STORE-09, STORE-11, STORE-12
**Success Criteria** (what must be TRUE):
  1. User can add products to cart, update quantities, remove items, and cart persists across page navigation
  2. User can select custom color options on eligible products before adding to cart
  3. User completes purchase via Stripe Embedded Checkout with flat-rate shipping (no account required)
  4. User receives order confirmation email after successful payment, and confirmation page mentions handwritten thank-you note
  5. User can add a gift message at checkout for the recipient
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Admin & Order Management
**Goal**: Founders can manage their entire business from their phones -- orders, products, customers, and order tracking
**Depends on**: Phase 3
**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04, ADMIN-05, ADMIN-06, CUST-01, CUST-02
**Success Criteria** (what must be TRUE):
  1. Founders can view all orders with filtering/search and update fulfillment status (New > Making > Shipped > Delivered)
  2. Founders can add, edit, and remove products with photos from a mobile-friendly interface
  3. Founders receive email notification when a new order is placed
  4. Dashboard displays customer info including contact details, shipping address, order history, and custom requests
  5. Customer can check order status using order number or email and see current fulfillment stage (no login required)
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

### Phase 5: Polish & Launch
**Goal**: The site is fast, resilient, and ready for real customers to find via Instagram links
**Depends on**: Phase 4
**Requirements**: None directly (validates and hardens all prior work)
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile performance score is 90+ on product catalog and detail pages
  2. Error states are handled gracefully (Stripe down, image load failure, empty cart checkout attempt)
  3. All Stripe test scenarios pass (successful payment, declined card, 3D Secure)
  4. Site is deployed to production with custom domain, HTTPS, and email deliverability configured (SPF/DKIM/DMARC)
**Plans**: TBD

Plans:
- [x] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-03-27 |
| 2. Storefront & Brand | 1/3 | In progress | - |
| 3. Cart & Checkout | 0/3 | Not started | - |
| 4. Admin & Order Management | 0/3 | Not started | - |
| 5. Polish & Launch | 1/2 | In Progress|  |
