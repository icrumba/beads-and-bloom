---
phase: 03-cart-checkout
plan: 03
subsystem: payments
tags: [stripe, webhook, resend, react-email, drizzle, order-management]

# Dependency graph
requires:
  - phase: 03-cart-checkout/03-01
    provides: "Stripe SDK, stripe.ts lib, schema with orders/customers/charityTotals tables"
  - phase: 03-cart-checkout/03-02
    provides: "Checkout session creation with metadata (cart_items, shipping_address, customer info)"
provides:
  - "Stripe webhook handler at /api/webhook for checkout.session.completed"
  - "Order creation with customer upsert, order items, and charity counter increment"
  - "Order confirmation email template via React Email + Resend"
  - "Idempotent webhook processing via stripeSessionId uniqueness check"
affects: [04-notifications, 05-admin]

# Tech tracking
tech-stack:
  added: [resend, "@react-email/components"]
  patterns: ["Webhook idempotency via DB uniqueness check", "React Email for transactional templates", "Email failure isolation in webhook handlers"]

key-files:
  created:
    - projects/briefs/beads-and-bloom-website/src/app/api/webhook/route.ts
    - projects/briefs/beads-and-bloom-website/src/emails/order-confirmation.tsx
  modified:
    - projects/briefs/beads-and-bloom-website/src/lib/queries.ts
    - projects/briefs/beads-and-bloom-website/package.json

key-decisions:
  - "Email failure does not fail webhook -- prevents Stripe retry storms from email outages"
  - "Resend instance created per-request rather than module-level for graceful missing API key handling"
  - "Line items from Stripe used for email pricing instead of cart metadata for accuracy"

patterns-established:
  - "Webhook idempotency: check DB for existing record before processing"
  - "Email isolation: wrap email sends in try/catch within webhooks"
  - "Customer upsert: onConflictDoUpdate on email for repeat buyers"

requirements-completed: [STORE-04, STORE-05]

# Metrics
duration: 6min
completed: 2026-03-28
---

# Phase 3 Plan 3: Webhook, Order Creation & Confirmation Email Summary

**Stripe webhook with idempotent order creation, customer upsert, charity counter increment, and React Email confirmation via Resend**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-28T03:45:48Z
- **Completed:** 2026-03-28T03:51:18Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Stripe webhook handler at /api/webhook processes checkout.session.completed events with signature verification
- Order creation pipeline: customer upsert by email, order + items insert, charity counter increment by $1
- React Email confirmation template with order details, brand messaging, thank-you note mention, and charity donation mention
- Idempotency check prevents duplicate orders on webhook retries via stripeSessionId lookup

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Resend + React Email, create email template and order queries** - `a808978` (feat)
2. **Task 2: Build Stripe webhook handler** - `5e8a831` (feat)

## Files Created/Modified
- `src/emails/order-confirmation.tsx` - React Email template with order details, items table, gift message, shipping address, thank-you note and charity mentions
- `src/app/api/webhook/route.ts` - Stripe webhook Route Handler with signature verification, idempotency, order creation, and email sending
- `src/lib/queries.ts` - Added createOrder (customer upsert + order + items + charity) and getOrderByStripeSession
- `src/lib/stripe.ts` - Server-side Stripe instance (dependency for webhook, also created by Plan 03-01)
- `package.json` - Added resend and @react-email/components dependencies

## Decisions Made
- Email failure does not fail webhook -- wrapped in try/catch so Resend outages don't trigger Stripe retries and potential duplicate orders
- Used Stripe line items data for email pricing rather than cart metadata for accuracy
- Created Resend instance per-request rather than module-level to handle missing RESEND_API_KEY gracefully
- Used raw req.text() for webhook body (not req.json()) per Stripe signature verification requirements

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed React Email Preview component type error**
- **Found during:** Task 1 (email template creation)
- **Issue:** Preview component requires string children, JSX interpolation produced ReactNode type
- **Fix:** Used template literal string instead of JSX interpolation for Preview content
- **Files modified:** src/emails/order-confirmation.tsx
- **Verification:** Build compiles without type errors
- **Committed in:** a808978 (Task 1 commit)

**2. [Rule 3 - Blocking] Installed stripe package and created stripe.ts for webhook dependency**
- **Found during:** Task 2 (webhook handler creation)
- **Issue:** Stripe package not available in parallel worktree (installed by Plan 03-01 in different worktree)
- **Fix:** Installed stripe@^17.7.0 and created src/lib/stripe.ts (identical to Plan 03-01's version)
- **Files modified:** package.json, package-lock.json, src/lib/stripe.ts
- **Verification:** Build compiles successfully
- **Committed in:** 5e8a831 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for correctness and build success. No scope creep.

## Issues Encountered
- Cloudinary NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME env var missing causes static page generation failure during build -- pre-existing issue from Phase 2, does not affect TypeScript compilation or this plan's code

## User Setup Required

The following environment variables must be configured for webhook and email functionality:
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (from Stripe Dashboard > Webhooks)
- `RESEND_API_KEY` - Resend API key for sending order confirmation emails
- `RESEND_FROM_EMAIL` - (Optional) Sender email address, defaults to "Beads & Bloom <orders@beadsandbloom.com>"

## Next Phase Readiness
- Full purchase loop is complete: cart -> checkout -> payment -> webhook -> order creation + confirmation email
- Ready for Phase 4 (notifications) to add SMS via Twilio and admin dashboard notifications
- Ready for Phase 5 (admin) to display orders with status management

---
*Phase: 03-cart-checkout*
*Completed: 2026-03-28*
