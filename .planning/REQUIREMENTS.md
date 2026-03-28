# Requirements: Beads & Bloom E-Commerce Website

**Defined:** 2026-03-27
**Core Value:** Customers can browse, order, and pay for handmade jewelry on mobile — and the founders get notified and can track every order from placement to delivery.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Storefront

- [x] **STORE-01**: User can browse products in a mobile-responsive grid catalog
- [x] **STORE-02**: User can view product detail page with photos, description, price, materials, and care info
- [ ] **STORE-03**: User can add products to cart, update quantities, and remove items
- [ ] **STORE-04**: User can complete purchase via Stripe guest checkout (no account required)
- [ ] **STORE-05**: User receives order confirmation email after successful payment
- [ ] **STORE-06**: User can view flat-rate shipping info page
- [ ] **STORE-07**: User can view return/refund policy page
- [x] **STORE-08**: Product pages have SEO metadata (title tags, descriptions, OG images)
- [ ] **STORE-09**: User can select custom color options on eligible products
- [x] **STORE-10**: Products display "Ready to ship" vs "Made to order (5-7 days)" flags
- [ ] **STORE-11**: User can add a gift message at checkout for the recipient
- [ ] **STORE-12**: Checkout confirmation page mentions a handwritten thank-you note is included with every order

### Customer Experience

- [ ] **CUST-01**: User can check order status using order number or email (no login required)
- [ ] **CUST-02**: Order tracking page shows current fulfillment status (New → Making → Shipped → Delivered)

### Brand & Mission

- [ ] **BRAND-01**: About page tells the founder story (twin teens, ocean inspiration, charity mission)
- [ ] **BRAND-02**: Homepage displays running charity donation counter (auto-calculated from completed orders)
- [ ] **BRAND-03**: Contact page with email and Instagram DM link
- [ ] **BRAND-04**: Instagram feed or curated gallery on homepage linking to Instagram

### Admin Dashboard

- [ ] **ADMIN-01**: Founders can view all orders with filtering and search
- [ ] **ADMIN-02**: Founders can update order fulfillment status (New → Making → Shipped → Delivered)
- [ ] **ADMIN-03**: Founders can add, edit, and remove products with photos
- [ ] **ADMIN-04**: Founders receive email notification when a new order is placed
- [ ] **ADMIN-05**: Dashboard displays customer info (contact, shipping, order history, custom requests)
- [ ] **ADMIN-06**: Admin interface is mobile-friendly and simple enough for teen founders

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Notifications

- **SMS-01**: Founders receive SMS notification for new orders

### Marketing

- **DISC-01**: Discount/coupon code support at checkout

### International

- **INTL-01**: International shipping and multi-currency support

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Customer accounts / login | Guest checkout only — reduces complexity, avoids COPPA concerns for under-13 audience |
| Inventory management system | Small-batch handmade — manual in-stock/sold-out toggle is sufficient |
| Blog / content section | Instagram is the content channel — a dead blog looks worse than none |
| Live chat / chatbot | Email + Instagram DMs sufficient at this scale |
| Calculated shipping by weight | Flat-rate is simpler and correct for lightweight jewelry |
| Loyalty / rewards program | Overkill for small catalog — customers buy for the brand, not points |
| Wishlist / favorites | Small catalog means customers can browse everything quickly |
| AR / virtual try-on | Enterprise feature, wildly over-scoped for a teen handmade brand |
| Email marketing / newsletter | Requires ongoing content creation founders won't sustain |
| Native mobile app | Web-first, mobile-responsive is sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STORE-01 | Phase 2: Storefront & Brand | Complete |
| STORE-02 | Phase 2: Storefront & Brand | Complete |
| STORE-03 | Phase 3: Cart & Checkout | Pending |
| STORE-04 | Phase 3: Cart & Checkout | Pending |
| STORE-05 | Phase 3: Cart & Checkout | Pending |
| STORE-06 | Phase 2: Storefront & Brand | Pending |
| STORE-07 | Phase 2: Storefront & Brand | Pending |
| STORE-08 | Phase 2: Storefront & Brand | Complete |
| STORE-09 | Phase 3: Cart & Checkout | Pending |
| STORE-10 | Phase 2: Storefront & Brand | Complete |
| STORE-11 | Phase 3: Cart & Checkout | Pending |
| STORE-12 | Phase 3: Cart & Checkout | Pending |
| CUST-01 | Phase 4: Admin & Order Management | Pending |
| CUST-02 | Phase 4: Admin & Order Management | Pending |
| BRAND-01 | Phase 2: Storefront & Brand | Pending |
| BRAND-02 | Phase 2: Storefront & Brand | Pending |
| BRAND-03 | Phase 2: Storefront & Brand | Pending |
| BRAND-04 | Phase 2: Storefront & Brand | Pending |
| ADMIN-01 | Phase 4: Admin & Order Management | Pending |
| ADMIN-02 | Phase 4: Admin & Order Management | Pending |
| ADMIN-03 | Phase 4: Admin & Order Management | Pending |
| ADMIN-04 | Phase 4: Admin & Order Management | Pending |
| ADMIN-05 | Phase 4: Admin & Order Management | Pending |
| ADMIN-06 | Phase 4: Admin & Order Management | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after roadmap creation*
