---
phase: 04-admin-order-management
plan: 01
subsystem: auth, admin, notifications, ui
tags: [middleware, cookies, react-email, resend, shadcn, tanstack-table, order-tracking, admin-auth]

# Dependency graph
requires:
  - phase: 03-cart-checkout
    provides: orders table, webhook route, order-confirmation email template, Stripe checkout
provides:
  - Admin auth middleware with cookie-based session protection
  - Admin layout shell with top navigation (Orders, Products, Customers)
  - Admin notification email sent on new orders via webhook
  - Public /track page with 4-stage order progress bar
  - Admin query functions (getAdminOrders, getOrderDetail, getAllProducts, getProductById, getAdminCustomers)
  - shadcn UI components (table, input, label, select, switch, textarea, dialog, dropdown-menu)
  - @tanstack/react-table and date-fns dependencies
affects: [04-02-order-management, 04-03-product-customer-management]

# Tech tracking
tech-stack:
  added: [@tanstack/react-table, date-fns, shadcn/table, shadcn/input, shadcn/label, shadcn/select, shadcn/switch, shadcn/textarea, shadcn/dialog, shadcn/dropdown-menu]
  patterns: [route-group-separation, middleware-auth, lazy-stripe-proxy, admin-notification-email]

key-files:
  created:
    - src/middleware.ts
    - src/actions/admin-auth.ts
    - src/app/admin/layout.tsx
    - src/app/admin/login/page.tsx
    - src/app/admin/page.tsx
    - src/components/admin/admin-nav.tsx
    - src/emails/admin-notification.tsx
    - src/actions/track.ts
    - src/components/track/order-progress.tsx
    - src/app/(store)/track/page.tsx
    - src/app/(store)/layout.tsx
  modified:
    - src/app/layout.tsx
    - src/app/api/webhook/route.ts
    - src/lib/queries.ts
    - src/lib/stripe.ts
    - src/actions/stripe.ts
    - next.config.ts
    - package.json

key-decisions:
  - "Route groups: moved store pages to (store) group so admin layout has no Header/Footer"
  - "Lazy Stripe proxy pattern to avoid build failures without STRIPE_SECRET_KEY"
  - "Cloudinary fallback in next.config.ts to prevent static generation failures"
  - "Track page placed in (store) group for consistent public site Header/Footer"

patterns-established:
  - "Route group separation: (store) for public pages with Header/Footer, /admin for admin shell"
  - "Admin auth: middleware cookie check + server action login/logout"
  - "Admin queries: centralized in queries.ts for all admin pages to share"

requirements-completed: [ADMIN-04, ADMIN-06, CUST-01, CUST-02]

# Metrics
duration: 10min
completed: 2026-03-28
---

# Phase 4 Plan 01: Admin Foundation Summary

**Middleware-based admin auth with cookie session, admin layout shell, order notification email via webhook, and public /track page with 4-stage progress bar**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-28T04:17:14Z
- **Completed:** 2026-03-28T04:27:14Z
- **Tasks:** 3
- **Files modified:** 38

## Accomplishments
- Admin route protection via middleware checking admin_session cookie
- Password login page with 7-day httpOnly cookie session
- Admin layout with top navigation bar (Orders, Products, Customers, Logout)
- Admin notification email sent alongside customer confirmation on new orders
- Public /track page where customers enter order number + email to see status
- Visual 4-stage progress bar (Ordered -> Making -> Shipped -> Delivered)
- All admin query functions ready for Plans 02 and 03

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, admin auth, admin layout shell** - `7acc837` (feat)
2. **Task 2: Admin notification email and webhook update** - `91c60de` (feat)
3. **Task 3: Public order tracking page with progress bar** - `556ea52` (feat)

## Files Created/Modified
- `src/middleware.ts` - Admin route protection (cookie check, redirect to login)
- `src/actions/admin-auth.ts` - Login/logout server actions with cookie management
- `src/app/admin/login/page.tsx` - Password login page with teal-branded UI
- `src/app/admin/layout.tsx` - Admin shell with AdminNav, no store Header/Footer
- `src/app/admin/page.tsx` - Redirect to /admin/orders
- `src/components/admin/admin-nav.tsx` - Top nav with active link highlighting
- `src/emails/admin-notification.tsx` - Scannable order notification email for founders
- `src/app/api/webhook/route.ts` - Extended to send admin notification email
- `src/actions/track.ts` - Order lookup server action with zod validation
- `src/components/track/order-progress.tsx` - 4-stage visual progress bar
- `src/app/(store)/track/page.tsx` - Public order tracking page
- `src/app/(store)/layout.tsx` - Store layout with Header/Footer
- `src/lib/queries.ts` - Added tracking + admin queries (6 new functions)
- `src/lib/stripe.ts` - Lazy proxy to avoid build-time errors
- `src/actions/stripe.ts` - Fixed ui_mode type error
- `next.config.ts` - Cloudinary fallback for static generation

## Decisions Made
- **Route groups for layout separation:** Moved all store pages into `(store)` route group so admin pages get their own layout without store Header/Footer. This is the standard Next.js App Router pattern for multiple layouts.
- **Lazy Stripe proxy:** Applied the same lazy proxy pattern used for DB connection (Phase 2 decision) to the Stripe client, preventing build failures when STRIPE_SECRET_KEY is not available.
- **Cloudinary build fallback:** Added fallback cloud name in next.config.ts so static generation doesn't fail without the env var.
- **Track page in store group:** The /track page is public-facing so it uses the store layout with Header/Footer for consistent navigation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Stripe ui_mode type error**
- **Found during:** Task 1 (build verification)
- **Issue:** Pre-existing Phase 3 code used `"embedded_page"` instead of `"embedded"` for Stripe checkout ui_mode
- **Fix:** Changed to `"embedded"` to match Stripe TypeScript types
- **Files modified:** src/actions/stripe.ts
- **Verification:** Build passes
- **Committed in:** 7acc837 (Task 1 commit)

**2. [Rule 3 - Blocking] Applied lazy proxy pattern to Stripe client**
- **Found during:** Task 1 (build verification)
- **Issue:** Stripe client was instantiated at module level with `!` assertion, causing build failure without STRIPE_SECRET_KEY
- **Fix:** Applied lazy proxy pattern (same as DB connection from Phase 2)
- **Files modified:** src/lib/stripe.ts
- **Verification:** Build passes without env vars
- **Committed in:** 7acc837 (Task 1 commit)

**3. [Rule 3 - Blocking] Added Cloudinary fallback in next.config.ts**
- **Found during:** Task 1 (build verification)
- **Issue:** Static page generation failed because next-cloudinary requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME at build time
- **Fix:** Added fallback value in next.config.ts env section
- **Files modified:** next.config.ts
- **Verification:** Build passes, static pages generate
- **Committed in:** 7acc837 (Task 1 commit)

**4. [Rule 2 - Missing Critical] Created (store) route group for layout separation**
- **Found during:** Task 1 (admin layout creation)
- **Issue:** Root layout included Header/Footer, making it impossible for admin to have its own shell without them
- **Fix:** Moved Header/Footer into (store) route group layout, kept root layout minimal
- **Files modified:** src/app/layout.tsx, created src/app/(store)/layout.tsx, moved all store pages
- **Verification:** Build passes, admin pages render without store chrome
- **Committed in:** 7acc837 (Task 1 commit)

**5. [Rule 2 - Missing Critical] Created placeholder admin section pages**
- **Found during:** Task 1 (admin layout creation)
- **Issue:** Admin layout links to /admin/orders, /admin/products, /admin/customers but no pages exist yet (Plans 02/03 build these)
- **Fix:** Created placeholder pages so routes resolve and build passes
- **Files modified:** Created src/app/admin/orders/page.tsx, products/page.tsx, customers/page.tsx
- **Verification:** Build passes, routes resolve
- **Committed in:** 7acc837 (Task 1 commit)

---

**Total deviations:** 5 auto-fixed (3 blocking, 2 missing critical)
**Impact on plan:** All auto-fixes were necessary for the build to pass. Route group separation was an architectural decision needed to fulfill the plan's requirement that admin has its own shell. No scope creep.

## Issues Encountered
- Pre-existing build failures from Phase 3 (Stripe type error, module-level instantiation, Cloudinary env var) required fixes before any Phase 4 work could be verified. These were all resolved with minimal, non-invasive changes.

## User Setup Required

The following environment variables need to be added to `.env.local`:

| Variable | Purpose | How to get it |
|----------|---------|---------------|
| `ADMIN_PASSWORD` | Shared password for admin login | Choose a password for the two founders |
| `ADMIN_SESSION_SECRET` | Cookie signing secret | Run `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Where order notification emails go | The founders' email address |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Product image uploads | Cloudinary Dashboard -> Settings -> Upload -> Add unsigned preset |

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| src/app/admin/orders/page.tsx | 4 | "Order management coming in Plan 02" | Placeholder -- Plan 02 builds the full order management UI |
| src/app/admin/products/page.tsx | 4 | "Product management coming in Plan 03" | Placeholder -- Plan 03 builds the full product management UI |
| src/app/admin/customers/page.tsx | 4 | "Customer list coming in Plan 03" | Placeholder -- Plan 03 builds the full customer list |

These stubs do NOT prevent Plan 01's goals from being achieved. They are intentional placeholders for downstream plans.

## Next Phase Readiness
- Admin auth + layout shell is ready for Plans 02 (order management) and 03 (product/customer management)
- All admin query functions are in queries.ts ready for use
- shadcn components (table, dialog, select, etc.) are installed and ready
- @tanstack/react-table is installed for data tables in Plans 02/03

---
*Phase: 04-admin-order-management*
*Completed: 2026-03-28*
