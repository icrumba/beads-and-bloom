# Feature Landscape

**Domain:** Small-batch handmade jewelry e-commerce (teen-founded, charity-integrated, Instagram-driven)
**Researched:** 2026-03-27

## Table Stakes

Features users expect from any small jewelry e-commerce site. Missing any of these and visitors bounce or don't trust the checkout.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mobile-responsive product catalog | 80%+ traffic from Instagram links on phones. Non-negotiable. | Medium | Grid layout, product cards with images + price. Every competitor has this. |
| High-quality product photography | Jewelry is visual-first. Bad photos = no sales, period. | Low (tech) / High (content) | Tech is just image display; the real work is photography. Support multiple images per product. |
| Product detail pages | Customers need materials, sizing, care info before buying jewelry sight-unseen. | Low | Title, description, price, images, material info, variant selector. |
| Stripe checkout (guest) | Secure payment without account creation. PROJECT.md specifies Stripe + guest checkout. | Medium | Stripe Checkout Session or Payment Intents. Guest-only simplifies auth dramatically. |
| Cart functionality | Users browse multiple products before buying. Single-product checkout feels broken. | Medium | Add to cart, view cart, update quantities, remove items. Persist across page navigation. |
| Shipping information page | Customers won't buy if they don't know shipping cost/timeline upfront. | Low | Flat-rate display, estimated delivery window, domestic-only note. |
| Return/refund policy | Legal requirement and trust signal. Every real store has one. | Low | Static page. Handmade items typically have limited returns; be upfront. |
| SSL / secure checkout indicators | Users look for the lock icon, especially on unknown small shops. | Low | Handled by hosting platform (Vercel/Netlify) + Stripe. Just don't break it. |
| About / founder story page | Handmade buyers want to know who made their jewelry. This is the #1 trust builder for indie brands. | Low | Teen twins story, ocean inspiration, charity mission. This is a strength -- lean into it. |
| Contact method | Customers need a way to ask questions pre-purchase. | Low | Email and/or Instagram DM link. No live chat needed at this scale (confirmed out of scope). |
| Order confirmation email | Customers expect immediate confirmation after payment. | Low | Stripe/transactional email. "We got your order, here's what you bought." |
| Basic SEO metadata | Products need to be findable via Google. Title tags, descriptions, OG images. | Low | Per-page meta tags. Critical for organic discovery beyond Instagram. |

## Differentiators

Features that set Beads & Bloom apart. Not expected by default, but they create competitive advantage given the brand's unique positioning.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Running charity donation counter | "$1 from every sale" is core brand identity. A live counter on the homepage turns passive mission text into visible impact proof. Few small shops do this. | Low | Simple counter: total orders x $1. Can be a DB query or static number updated periodically. Homepage placement. |
| Custom color request on products | Lets customers personalize bead bracelets. Moves from "buy what's available" to "co-create with the maker." Most small shops don't offer this. | Medium | Form field or color picker on eligible products. Creates a made-to-order workflow. Needs to flow into order data so founders know what to make. |
| Fulfillment status tracking (founder-facing) | New -> Making -> Shipped -> Delivered pipeline. Most small handmade sellers use spreadsheets or Etsy's built-in tools. A simple dashboard gives the twins professional-grade order management. | High | Admin dashboard with status updates, filtering, notifications. This is the most complex feature but critical for the founders' workflow. |
| Multi-channel order notifications (email + SMS + dashboard) | Founders never miss an order. Redundancy matters when you're 13 and checking your phone between school and activities. | Medium | Email via transactional service, SMS via Twilio or similar, plus dashboard inbox. Three channels = three integrations. |
| Made-to-order vs ready-to-ship distinction | Some pieces ship immediately, custom color requests need crafting time. Showing this clearly sets expectations and reduces support questions. | Low | Product-level flag. Display "Ready to ship" vs "Made to order (5-7 days)" on product pages. |
| Founder-friendly admin dashboard | Admin designed for teen usability, not enterprise complexity. Big buttons, clear status, mobile-friendly admin. This IS the product for the founders. | High | Simplified order management, product CRUD, notification center. Must work well on mobile since founders likely manage from phones too. |
| Instagram integration touchpoints | Primary audience arrives from Instagram. Deep linking back (tagged products, IG feed on site, "shop our Instagram" section) closes the loop. | Low-Medium | Embed IG feed or curated gallery. Link products to IG posts. Not a full integration -- just visual connection. |

## Anti-Features

Features to explicitly NOT build. Each one is tempting but wrong for Beads & Bloom v1.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Customer accounts / login | Adds authentication complexity, COPPA concerns (audience includes under-13), and friction to checkout. Guest checkout converts better for impulse buys from Instagram. | Guest checkout only. Track customers by email in order records. |
| Inventory management system | Small-batch handmade means the twins know what they have. Building inventory tracking adds complexity with no payoff at this volume. | Manual product availability toggling (in-stock / sold-out toggle per product). |
| Blog / content section | Founders are 13 -- they won't maintain a blog. Instagram IS their content channel. A dead blog looks worse than no blog. | Link to Instagram for content. About page tells the story once. |
| AR / virtual try-on | Enterprise-grade feature that big brands (Tiffany, Cartier) use. Wildly over-scoped for a teen handmade brand. | Good product photography from multiple angles. |
| Loyalty / rewards program | Adds significant complexity (point tracking, tiers, redemption). Overkill for a small catalog with repeat customers who buy because they love the brand, not points. | Occasional Instagram-promoted discount codes for returning customers. |
| Multi-currency / international shipping | Adds tax complexity, customs handling, variable shipping rates. Domestic-only is correct for v1. | Note "US shipping only" clearly. Revisit if international demand appears. |
| Calculated shipping by weight | Every product is lightweight jewelry. Flat-rate is simpler and likely cheaper for the business at this volume. | Flat-rate shipping, prominently displayed. |
| Email marketing / newsletter system | Requires ongoing content creation the founders won't sustain. Instagram is the engagement channel. | Collect emails via orders for transactional use. Add newsletter later if founders want it. |
| Live chat / chatbot | Support volume doesn't justify it. The twins respond via Instagram DMs and email -- that's fine at this scale. | Email + Instagram DM links on contact page. |
| Discount code / coupon system | Adds checkout complexity. At v1 scale, the twins can adjust prices manually or offer deals via Instagram stories with specific product links. | If needed later, Stripe supports coupon codes natively -- easy to add in v2. |
| Wishlist / favorites | Requires session persistence or accounts. Low value when the catalog is small and customers arrive with purchase intent from Instagram. | Small catalog means customers can browse everything quickly. |

## Feature Dependencies

```
Product Catalog ──────────────> Product Detail Pages
                                    │
                                    ├──> Cart ──> Stripe Checkout ──> Order Confirmation Email
                                    │                    │
                                    │                    └──> Order Created in DB
                                    │                              │
                                    ├──> Custom Color Request       ├──> Multi-channel Notifications
                                    │    (form on product page)     │    (email + SMS + dashboard)
                                    │         │                     │
                                    │         └─────────────────────├──> Fulfillment Tracking
                                    │                               │    (New → Making → Shipped → Delivered)
                                    │                               │
                                    │                               └──> Charity Counter
                                    │                                    (increments on order)
                                    │
                                    └──> Made-to-order flag (display only)

Admin Dashboard ──> Product Management (CRUD)
                ──> Order Management (status updates)
                ──> Notification Center (incoming orders)

About Page, Shipping Policy, Return Policy ──> (independent, no dependencies)
```

Key dependency chain: **Product pages must exist before cart works, cart before checkout, checkout before orders exist, orders before fulfillment tracking or notifications make sense.** The charity counter depends on orders existing in the database.

The admin dashboard is a parallel track -- it reads/writes the same data (products, orders) but can be built independently of the customer-facing storefront.

## MVP Recommendation

**Phase 1 -- Storefront (customers can browse and buy):**
1. Mobile-responsive product catalog with detail pages
2. Cart + Stripe guest checkout
3. Order confirmation email
4. Flat-rate shipping info + return policy page
5. About / founder story page
6. Basic SEO metadata
7. Charity donation counter (homepage -- even a static number to start)

**Phase 2 -- Operations (founders can manage orders):**
1. Admin dashboard with order list + status tracking
2. Product management (add/edit/remove products)
3. Multi-channel notifications (email first, then SMS)
4. Made-to-order vs ready-to-ship flags
5. Custom color request flow

**Defer to v2+:**
- Instagram feed embed (nice visual touch but not revenue-driving)
- SMS notifications (email + dashboard may be sufficient initially)
- Discount codes (if demand warrants it)

**Rationale:** Get the storefront live first so customers can buy. The admin dashboard is critical but the founders can manage initial orders via email notifications + a simple order list while the full dashboard is built. Custom color requests are a differentiator but require both front-end UI and back-end workflow -- better to nail basic ordering first.

## Sources

- [Omnisend: Jewelry Ecommerce Guide](https://www.omnisend.com/blog/jewelry-ecommerce/)
- [3PTechies: Smart Jewelry Website Development 2026](https://www.3ptechies.com/building-smart-jewelry-website.html)
- [ROOTSSEA](https://rootssea.com/) -- Real small-batch handmade jewelry site (custom orders, collections, fulfillment windows)
- [WATERSANDSTONE](https://watersandstone.com/) -- Real small-batch handmade jewelry site (reviews, newsletter, care guide)
- [Givz: Charitable Donations in Ecommerce](https://www.givz.com/blog/story-of-a-brand)
- [Shopify: Sell Jewelry Online](https://www.shopify.com/sell/jewelry)
- [PageFly: Top Shopify Jewelry Stores](https://pagefly.io/blogs/shopify/best-shopify-jewelry-stores)
