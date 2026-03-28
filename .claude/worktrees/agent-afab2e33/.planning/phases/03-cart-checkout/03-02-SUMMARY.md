---
phase: 03-cart-checkout
plan: 02
subsystem: payments
tags: [stripe, checkout, embedded-checkout, server-actions, zod, zustand]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Database schema (products, orders, customers tables), Drizzle ORM setup, types
  - phase: 03-01
    provides: Cart store with Zustand, cart drawer UI, add-to-cart flow
provides:
  - Stripe checkout session creation via Server Action with server-side price validation
  - Checkout page with customer info form and Stripe Embedded Checkout
  - Order confirmation page with thank-you note and charity donation callouts
  - Stripe singleton instance for server-side API calls
affects: [03-cart-checkout, 04-admin-notifications]

# Tech tracking
tech-stack:
  added: [stripe@21.0.1, "@stripe/stripe-js@9", "@stripe/react-stripe-js@6", zustand@5]
  patterns: [Server Action for Stripe session, embedded_page ui_mode, zod validation in Server Actions, server-side price lookup]

key-files:
  created:
    - projects/briefs/beads-and-bloom-website/src/lib/stripe.ts
    - projects/briefs/beads-and-bloom-website/src/actions/stripe.ts
    - projects/briefs/beads-and-bloom-website/src/app/checkout/page.tsx
    - projects/briefs/beads-and-bloom-website/src/components/checkout/checkout-form.tsx
    - projects/briefs/beads-and-bloom-website/src/components/checkout/stripe-checkout.tsx
    - projects/briefs/beads-and-bloom-website/src/app/order/confirmation/page.tsx
    - projects/briefs/beads-and-bloom-website/src/lib/cart-store.ts
    - projects/briefs/beads-and-bloom-website/src/lib/use-hydrated-store.ts
  modified:
    - projects/briefs/beads-and-bloom-website/package.json

key-decisions:
  - "Stripe SDK v21 uses ui_mode embedded_page (not embedded) -- API naming changed"
  - "Server-side price lookup from DB prevents client price manipulation"
  - "Created cart-store stub for parallel build -- Plan 01 provides full implementation"
  - "Zod v4 with z.email() for email validation"

patterns-established:
  - "Server Action pattern: validate with zod, fetch DB prices, create Stripe session"
  - "Stripe Embedded Checkout: loadStripe at module level, pass clientSecret to EmbeddedCheckoutProvider"
  - "Two-step checkout: customer form -> order summary/payment"

requirements-completed: [STORE-04, STORE-12]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 3 Plan 2: Stripe Checkout Flow Summary

**Stripe Embedded Checkout with customer info form, server-side price validation, flat-rate shipping, and confirmation page with charity/thank-you callouts**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-28T03:34:12Z
- **Completed:** 2026-03-28T03:42:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Stripe Embedded Checkout integrated via Server Action (not API route, per D-09)
- Customer info form with zod validation collects name, email, phone, shipping address before payment
- Server-side product price lookup prevents price manipulation attacks
- Confirmation page shows order details, handwritten thank-you note mention, and $1 charity donation to The Storehouse (per D-13)
- Flat-rate $5 shipping included as Stripe line item (per D-07)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Stripe packages, create Stripe singleton and Server Action** - `8242bd9` (feat)
2. **Task 2: Build checkout page, customer form, Stripe Embedded Checkout, confirmation page** - `d80867f` (feat)

## Files Created/Modified
- `src/lib/stripe.ts` - Stripe server-side singleton
- `src/actions/stripe.ts` - Server Action: validates input with zod, looks up DB prices, creates embedded checkout session
- `src/components/checkout/checkout-form.tsx` - Two-step customer info form with validation
- `src/components/checkout/stripe-checkout.tsx` - EmbeddedCheckoutProvider wrapper
- `src/app/checkout/page.tsx` - Checkout page with empty cart guard and form-to-payment flow
- `src/app/order/confirmation/page.tsx` - Post-payment confirmation with order summary, thank-you note, charity callouts
- `src/lib/cart-store.ts` - Cart store stub (parallel build compatibility)
- `src/lib/use-hydrated-store.ts` - Hydration-safe hook for Zustand SSR

## Decisions Made
- Stripe SDK v21 uses `ui_mode: 'embedded_page'` instead of `'embedded'` -- the API naming changed in this version
- Server-side price lookup from DB is critical security: never trust client-sent prices
- Created cart-store.ts stub since Plan 01 (which creates the full cart store) runs in parallel -- this will be merged/replaced
- Used zod/v4 import path consistent with installed zod@4.3.6

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stripe ui_mode value changed in SDK v21**
- **Found during:** Task 1 (Server Action implementation)
- **Issue:** Plan specified `ui_mode: 'embedded'` but Stripe SDK v21 types expect `'embedded_page'`
- **Fix:** Changed to `ui_mode: 'embedded_page'` which is the correct value for Stripe SDK v21
- **Files modified:** src/actions/stripe.ts
- **Verification:** TypeScript compiles without errors
- **Committed in:** 8242bd9

**2. [Rule 3 - Blocking] Created cart-store stub for parallel build**
- **Found during:** Task 2 (Checkout page needs cart state)
- **Issue:** cart-store.ts does not exist yet because Plan 01 creates it in parallel
- **Fix:** Created a complete cart-store.ts stub matching the interface specification from the plan, plus use-hydrated-store.ts hook. Also installed zustand.
- **Files modified:** src/lib/cart-store.ts, src/lib/use-hydrated-store.ts, package.json
- **Verification:** Build compiles, checkout page renders correctly
- **Committed in:** d80867f

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for compilation. Cart store stub will be superseded by Plan 01's implementation during merge. No scope creep.

## Known Stubs

- `src/lib/cart-store.ts` - Stub implementation for parallel build. Plan 01 provides the full cart store with identical interface. Will be resolved at merge.

## Issues Encountered
- Cloudinary env var (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) not set causes static export failure on pages using CldImage -- pre-existing issue, not related to this plan. TypeScript compilation succeeds.

## User Setup Required

Stripe environment variables needed in `.env.local`:
- `STRIPE_SECRET_KEY` - Stripe secret key for server-side API calls
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for client-side Stripe.js
- `NEXT_PUBLIC_BASE_URL` - Base URL for return_url (e.g., `http://localhost:3000`)

## Next Phase Readiness
- Checkout flow complete -- ready for webhook (Plan 03) to process payments and create orders
- Confirmation page reads from Stripe session, will work once real payments are processed
- Cart store stub will be replaced when Plan 01 merges

## Self-Check: PASSED

All 8 created files verified present. Both task commits (8242bd9, d80867f) verified in git log.

---
*Phase: 03-cart-checkout*
*Completed: 2026-03-28*
