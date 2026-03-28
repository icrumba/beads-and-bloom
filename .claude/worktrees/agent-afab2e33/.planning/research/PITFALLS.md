# Pitfalls Research

**Domain:** Small-batch handmade jewelry e-commerce (Beads & Bloom)
**Researched:** 2026-03-27
**Confidence:** HIGH (domain well-documented, Stripe integration patterns well-established)

## Critical Pitfalls

### Pitfall 1: Stripe Webhook Unreliability Leading to Lost Orders

**What goes wrong:**
The checkout succeeds (customer is charged) but the webhook that creates the order record in your database fails silently. The founders never get notified, the customer thinks they ordered, and no one realizes the order was lost until the customer complains days later. This is the single most damaging failure mode for a small shop where every order matters.

**Why it happens:**
Developers treat the Stripe webhook endpoint like a simple POST handler. They don't account for: duplicate delivery (Stripe retries up to 3 days), out-of-order events, server downtime during webhook delivery, or failing to return 200 quickly enough (causing Stripe to retry and create duplicate orders). Many tutorials show a happy-path-only implementation.

**How to avoid:**
1. Use Stripe Checkout Sessions (hosted or embedded) -- they handle edge cases that custom forms miss
2. Verify webhook signatures using `stripe.webhooks.constructEvent()` with the raw request body (not parsed JSON)
3. Implement idempotency: store processed event IDs and skip duplicates
4. Return 200 immediately, then process asynchronously
5. Use `checkout.session.completed` as the primary order-creation trigger, not `payment_intent.succeeded`
6. Build a reconciliation check: compare Stripe dashboard payments against your order database daily (can be manual at this scale)

**Warning signs:**
- Stripe dashboard shows successful payments that don't appear in your admin
- Customer emails asking "where's my order?" when no order exists in your system
- Webhook endpoint logs showing 500 errors or timeouts

**Phase to address:**
Payment integration phase. Webhook handling must be built correctly from day one -- retrofitting idempotency is painful.

---

### Pitfall 2: Notification Single Point of Failure

**What goes wrong:**
The founders rely on one notification channel (typically email) and miss orders because emails land in spam, SMS credits run out, or the notification service has an outage. For teen founders who may not check email obsessively, a missed notification means a missed order that sits unfulfilled for days.

**Why it happens:**
Developers implement notifications as fire-and-forget: send the email/SMS in the webhook handler and assume it arrived. No retry logic, no fallback channel, no way to verify delivery. SMS providers throttle or fail silently. Email providers flag transactional emails as spam if not configured with proper DNS records (SPF, DKIM, DMARC).

**How to avoid:**
1. The admin dashboard is the source of truth -- notifications are convenience, not the system of record
2. Dashboard must show new orders prominently with visual indicators (badge count, color coding) so founders can catch missed notifications on their next visit
3. Send both email AND SMS for new orders -- redundancy is the whole point
4. Use a transactional email service (Resend, SendGrid) with proper DNS auth, not raw SMTP
5. For SMS, use Twilio or a similar provider with delivery status callbacks
6. Log notification delivery status -- know when a notification failed to send
7. Consider a simple "unacknowledged order" alert: if an order hasn't been viewed in the dashboard within 2 hours, re-send notifications

**Warning signs:**
- Test notifications landing in spam folders during development
- SMS not arriving on certain carriers
- No logging of notification success/failure
- Founders saying "I didn't see that order come in"

**Phase to address:**
Notifications phase, but the dashboard must be built first as the reliable fallback. Never deploy payments without the dashboard being operational.

---

### Pitfall 3: Product Photos That Kill Mobile Conversions

**What goes wrong:**
Product images look fine on desktop but are oversized, slow-loading, or poorly cropped on mobile. Since 70%+ of this shop's traffic will come from Instagram links on phones, a slow or ugly mobile product page means immediate bounce. Jewelry is especially visual -- if the photos don't sell it, nothing will.

**Why it happens:**
Founders upload full-resolution photos from their phone camera (3-8MB each). No image optimization pipeline exists. Product pages load 5+ images at original resolution. On cellular connections, this means 3-5 second load times per product page. Additionally, photos that look great on Instagram's square crop look awkward when displayed in a different aspect ratio on the website.

**How to avoid:**
1. Build an image optimization pipeline from the start: accept uploads, auto-resize to multiple breakpoints (thumbnail, card, detail), convert to WebP/AVIF with JPEG fallback
2. Use Next.js Image component (or equivalent) with lazy loading and responsive srcset
3. Set a maximum upload size (2MB) with client-side compression before upload
4. Define consistent aspect ratios for product cards (1:1 square works well for jewelry and matches Instagram)
5. Implement lazy loading for below-the-fold images
6. Test on a throttled 3G connection during development -- if it's painful, customers will leave

**Warning signs:**
- Product page Lighthouse score below 70 on mobile
- Individual images over 500KB in the final rendered page
- No WebP/AVIF serving
- Product grid looking inconsistent (mixed aspect ratios)

**Phase to address:**
Product catalog phase. Image handling must be designed into the data model and upload flow, not bolted on later.

---

### Pitfall 4: Custom Orders Without a Clear Workflow

**What goes wrong:**
Custom color requests create an undefined workflow that falls between the cracks. A customer requests a custom combination, but there's no structured way to: confirm the request, quote a timeline, get approval before charging, track it separately from ready-to-ship orders, or communicate status updates. Custom orders end up as messy email threads that the founders lose track of.

**Why it happens:**
Custom orders are treated as a footnote -- "just add a text field." But custom orders have a fundamentally different lifecycle than ready-to-ship: they need a confirmation step (can we make this?), a longer fulfillment window, and clear customer communication about when to expect delivery. Without modeling this explicitly, the system treats all orders the same.

**How to avoid:**
1. Model custom orders as a distinct order type with additional states: Requested -> Confirmed -> Making -> Shipped -> Delivered (vs. standard: New -> Making -> Shipped -> Delivered)
2. The "Confirmed" step is critical -- it's where the founders review the custom request and accept or suggest alternatives before the customer is charged (or before fulfillment begins)
3. Keep the custom request structured: offer a dropdown of available bead colors rather than free-text (prevents "can you make it in a color you don't have?")
4. Set clear expectations on the product page: "Custom orders take 3-5 extra business days"
5. Auto-send a "we received your custom request" notification to the customer

**Warning signs:**
- Custom order requests sitting in a generic "notes" field with no dedicated UI
- No way to filter custom vs. standard orders in the dashboard
- Founders manually emailing customers about custom order status
- No timeline expectations set during checkout

**Phase to address:**
Must be designed in the data model phase (order schema) and implemented in the fulfillment tracking phase. Retrofitting a custom order workflow onto a flat order model is a significant rework.

---

### Pitfall 5: Admin Dashboard Too Complex for Teen Founders

**What goes wrong:**
The admin interface ends up looking like a developer tool instead of a simple order management screen. Too many fields, confusing navigation, technical jargon (webhook, fulfillment status codes, Stripe IDs), and no clear "what do I do next?" flow. The founders stop using it and go back to checking Instagram DMs and Etsy notifications, defeating the entire purpose of the site.

**Why it happens:**
Developers build admin panels for developers. Every database field gets exposed in the UI. Status management requires understanding the full order lifecycle. There's no progressive disclosure -- everything is shown at once. The admin is built last and gets the least design attention.

**How to avoid:**
1. Design the admin as a "to-do list," not a "database viewer" -- the primary view is "orders that need my attention" sorted by urgency
2. Use plain language: "Ready to ship" not "FULFILLMENT_PENDING", "Needs to be made" not "MANUFACTURING_QUEUE"
3. One-tap status updates: big obvious buttons like "Mark as Shipped" instead of dropdown menus
4. Hide technical details (Stripe payment IDs, webhook data, timestamps) behind an expandable "details" section
5. Mobile-first admin -- the founders will check orders on their phones
6. Test with the actual founders during development, not just the parent/developer

**Warning signs:**
- Admin screens with more than 5 columns in a table
- Status values that are SCREAMING_CASE constants
- No mobile-responsive admin layout
- Founders asking "what does this mean?" about any UI element

**Phase to address:**
Admin dashboard phase. But the UX principles must be established during design/planning -- if the data model exposes 20 fields, the admin will show 20 fields unless you deliberately constrain it.

---

### Pitfall 6: Shipping and Tax Misconfiguration

**What goes wrong:**
Flat-rate shipping sounds simple but creates edge cases: what about orders with 5+ items? What about local pickup (if offered)? Tax calculation is ignored entirely, then the founders realize they owe sales tax and have been eating the cost on every order. For a teen-run business, tax compliance mistakes could create real problems for the parents.

**Why it happens:**
"Flat-rate shipping" gets implemented as a hardcoded $5 added at checkout. No one considers: free shipping thresholds, shipping to PO boxes, or the fact that some states require sales tax collection on shipping charges too. Tax is punted because "we'll figure it out later" -- but Stripe doesn't automatically calculate or collect sales tax unless you configure it.

**How to avoid:**
1. Use Stripe Tax or a tax API (TaxJar) from day one -- even for domestic-only sales, nexus rules vary by state
2. Make the flat shipping rate configurable in the admin (not hardcoded) so founders can adjust without a code change
3. Decide upfront: is shipping included in the price, or added at checkout? Hidden costs cause 39% of cart abandonment
4. Display the total (product + shipping + tax) clearly before the payment step
5. For v1 with domestic-only flat-rate, Stripe Tax handles this well -- configure it during Stripe setup, not as an afterthought

**Warning signs:**
- Shipping rate hardcoded as a constant in source code
- No tax line item in the checkout flow
- "We'll add tax later" in the project backlog
- Order confirmation emails showing different totals than what was charged

**Phase to address:**
Payment/checkout phase. Tax and shipping must be part of the Stripe Checkout Session configuration, not a separate feature.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded product data (JSON file instead of CMS/database) | Fast to build, no admin UI needed for products | Every product change requires a code deploy. Founders can't update products themselves | MVP only -- migrate to admin-editable storage by phase 2 |
| Single flat shipping rate with no configuration | Simple checkout math | Can't adjust shipping without code changes, no free-shipping threshold | Acceptable for v1 if the rate is stored in env/config, not inline |
| Manual inventory tracking (no stock counts in system) | Avoids inventory management complexity | Overselling risk if a product goes viral, no automated "sold out" state | Acceptable at current volume. Add basic stock counts when order volume exceeds ~20/week |
| Storing images in the repo or filesystem | No external service dependency | Repo bloat, no CDN, slow load times as catalog grows | Never -- use cloud storage (Vercel Blob, Cloudinary, S3) from day one |
| No automated email for shipping confirmation | Less notification infrastructure to build | Customers have no tracking visibility, more "where's my order?" messages | MVP only -- add by fulfillment tracking phase |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Stripe Checkout | Using `payment_intent.succeeded` to create orders | Use `checkout.session.completed` -- it includes the full session metadata (customer email, line items, shipping) |
| Stripe Checkout | Not including `metadata` in the session | Always attach your internal order reference and product details to `metadata` -- you'll need it in the webhook handler |
| Stripe Checkout | Testing only with successful payments | Test declined cards (4000000000000002), insufficient funds (4000000000009995), and 3D Secure flows (4000002760003184) |
| Stripe Webhooks | Parsing the request body as JSON before signature verification | Stripe signature verification requires the RAW request body. In Next.js App Router, use `request.text()` not `request.json()` |
| SMS (Twilio) | Sending from a standard number without registering for A2P 10DLC | Unregistered business SMS gets filtered/blocked by carriers. Register your brand and campaign with Twilio's A2P 10DLC program |
| Email (Resend/SendGrid) | Sending from a gmail.com or personal domain without DNS auth | Set up SPF, DKIM, and DMARC records for your sending domain. Without these, emails land in spam |
| Image hosting | Serving images from the same server as the app | Use a CDN-backed image service. Vercel's built-in image optimization works if deploying to Vercel |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized product images | Product page takes 3+ seconds on mobile, high bounce rate | Auto-resize on upload, serve WebP, lazy load below-fold images | Immediately -- mobile users on cellular |
| No API response caching for product catalog | Every page load queries the database for all products | Cache product data aggressively (ISR/SSG for product pages, in-memory for API) -- catalog changes rarely | 50+ concurrent users (viral Instagram post) |
| Loading all products on the homepage | Homepage becomes slow as catalog grows | Paginate or limit to featured products, lazy-load the rest | 30+ products in catalog |
| Synchronous webhook processing | Stripe webhook times out, retries cause duplicate orders | Return 200 immediately, process order creation in background (queue or async) | First time two orders arrive within seconds of each other |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing Stripe secret key in client-side code | Anyone can charge cards, issue refunds, access customer data | Secret key stays server-side only. Use publishable key on client. In Next.js, only `NEXT_PUBLIC_` prefixed env vars are exposed to client |
| No webhook signature verification | Attackers can send fake webhook events to create fraudulent orders or manipulate order status | Always verify with `stripe.webhooks.constructEvent()` using your endpoint secret |
| Admin dashboard without authentication | Anyone who discovers the URL can view orders, customer data, and manage the store | Implement authentication for admin routes. Even a simple password gate is better than nothing for v1 |
| Storing customer email/address in plain text without access controls | Data exposure if database is compromised | Minimize stored PII -- Stripe already stores payment details. Only keep what you need for fulfillment. Restrict database access |
| No rate limiting on checkout | Bot abuse, card testing attacks (fraudsters testing stolen card numbers against your checkout) | Implement rate limiting on the checkout API route. Stripe Radar helps but isn't a complete solution |
| CORS misconfiguration allowing any origin | Cross-site request forgery, data theft | Restrict CORS to your domain only. Next.js API routes handle this well by default |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Checkout requires too many fields | Cart abandonment -- 18% abandon due to complexity | Name, email, shipping address, card. That's it. No phone number, no account creation, no separate billing address unless requested |
| No order confirmation page or email | Customer anxiety ("did my order go through?") | Show a clear confirmation page with order number, AND send a confirmation email immediately |
| Product pages with no size reference | Returns and complaints ("it's smaller than I expected") | Show jewelry on a wrist/neck for scale, or include dimensions. A coin or ruler for reference works too |
| Custom color picker that's overwhelming | Decision paralysis, abandoned customization | Limit to 6-8 curated color palettes instead of infinite color pickers. "Ocean Blue + Pearl White" not "#2B5F9E" |
| No clear return/exchange policy | Customer hesitation at checkout, chargebacks later | Display return policy on product pages and in checkout. Even "All sales final on custom orders" is better than silence |
| Charity counter that looks fake | Undermines trust instead of building it | Show a specific number ("$247 donated to [specific charity name]") not a vague "we donate." Link to the charity |
| Mobile checkout with tiny tap targets | Frustration, mis-taps, abandonment | Minimum 44px tap targets for all interactive elements. Test on actual phones, not just browser device emulation |

## "Looks Done But Isn't" Checklist

- [ ] **Stripe integration:** Tested with declined cards, not just successful payments -- verify error messages display correctly
- [ ] **Webhook handler:** Tested with duplicate events (same event ID twice) -- verify idempotency works
- [ ] **Email notifications:** Checked spam folders on Gmail, Outlook, and Yahoo -- verify DNS records (SPF/DKIM) are configured
- [ ] **SMS notifications:** Tested on multiple carriers (AT&T, T-Mobile, Verizon) -- verify A2P registration is complete
- [ ] **Mobile checkout:** Tested on actual iPhone and Android devices, not just Chrome DevTools -- verify keyboard doesn't cover form fields
- [ ] **Product images:** Tested on 3G throttled connection -- verify lazy loading and compression work
- [ ] **Order status updates:** Verified that status change triggers notifications to BOTH founders and customers
- [ ] **Custom orders:** Tested full lifecycle from request through delivery -- verify the "Confirmed" step exists before fulfillment begins
- [ ] **Admin dashboard:** Tested on a phone screen -- verify all actions are tappable and readable
- [ ] **Shipping calculation:** Verified tax is calculated and displayed before payment -- verify order totals match Stripe dashboard
- [ ] **Charity counter:** Verified it actually increments when orders are placed -- verify it reads from real data, not a static number
- [ ] **Error states:** Tested what happens when Stripe is down, SMS fails, email bounces -- verify graceful degradation

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Lost orders (webhook failure) | LOW | Compare Stripe dashboard payments to order database. Create missing orders manually. Implement reconciliation script |
| Missed notifications | LOW | Check dashboard for unacknowledged orders. Re-send notifications. Add the "stale order" re-notification system |
| Overselling a product | MEDIUM | Contact customer, apologize, offer refund or wait-for-restock. Add basic inventory counts to prevent recurrence |
| Tax not collected | HIGH | Calculate owed tax retroactively. May need to file amended returns. Consult accountant. Implement tax calculation going forward |
| Admin too complex for founders | MEDIUM | Redesign primary view as a simple to-do list. Hide advanced features. Requires UI rework but not data model changes |
| Customer data exposed | HIGH | Notify affected customers. Rotate all API keys. Audit access logs. Add authentication immediately. May have legal reporting obligations depending on state |
| Image-heavy pages killing performance | LOW | Add image optimization pipeline (resize, compress, convert to WebP). Can be done without changing data model. Use Next.js Image component |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Stripe webhook unreliability | Payment Integration | Test with Stripe CLI webhook forwarding, verify idempotency with duplicate events |
| Notification single point of failure | Notifications | Send test notifications to real phone/email, verify delivery logs exist |
| Product photos killing mobile performance | Product Catalog | Lighthouse mobile score above 80, no image over 200KB on product pages |
| Custom orders without workflow | Data Model + Fulfillment | Walk through full custom order lifecycle in admin, verify distinct states exist |
| Admin too complex for teens | Admin Dashboard | Have the actual founders test the admin on their phones, observe without helping |
| Shipping/tax misconfiguration | Payment Integration | Verify tax line item in Stripe checkout, test order total matches confirmation email |
| No admin authentication | Admin Dashboard | Verify admin routes return 401 without auth, test login flow |
| Cart abandonment from complex checkout | Checkout Flow | Count form fields (should be under 8), test full checkout in under 60 seconds |
| Storing images in repo | Product Catalog (architecture) | Verify images served from CDN URL, not relative file paths |
| No error state handling | Every Phase | Test each feature with its dependencies down (Stripe offline, SMS failed, etc.) |

## Sources

- [Stripe Webhook Best Practices](https://www.stigg.io/blog-posts/best-practices-i-wish-we-knew-when-integrating-stripe-webhooks)
- [Stripe Checkout Strategy](https://stripe.com/resources/more/checkout-strategy)
- [Stripe Mobile Checkout Best Practices](https://stripe.com/resources/more/mobile-checkout-best-practices-for-ecommerce-businesses)
- [Stripe Webhooks Documentation](https://docs.stripe.com/webhooks)
- [Building Solid Stripe Integrations](https://stripe.dev/blog/building-solid-stripe-integrations-developers-guide-success)
- [Handling Payment Webhooks Reliably](https://medium.com/@sohail_saifii/handling-payment-webhooks-reliably-idempotency-retries-validation-69b762720bf5)
- [Common E-commerce Mistakes - Shopify](https://www.shopify.com/blog/ecommerce-mistakes)
- [Mistakes New Jewelry Sellers Make - Branvas](https://branvas.com/blogs/news/mistakes-new-jewelry-sellers-make-and-how-to-avoid-them)
- [E-commerce Mistakes 2025 Guide - F22 Labs](https://www.f22labs.com/blogs/common-ecommerce-mistakes-2025-guide/)
- [SMS for E-commerce - MailerSend](https://www.mailersend.com/solutions/sms-for-e-commerce)

---
*Pitfalls research for: Beads & Bloom handmade jewelry e-commerce*
*Researched: 2026-03-27*
