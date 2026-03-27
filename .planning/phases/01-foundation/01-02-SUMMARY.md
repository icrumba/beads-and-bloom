---
phase: 01-foundation
plan: 02
subsystem: database
tags: [drizzle, postgres, neon, schema, typescript, enums, relations]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Next.js 15 project scaffold with Drizzle ORM + Neon driver installed, db/index.ts client, drizzle.config.ts"
provides:
  - "Complete Drizzle schema with 5 tables (products, customers, orders, order_items, charity_totals)"
  - "Two pgEnums: order_status (with confirmed step), availability"
  - "Drizzle relations connecting orders-customers, orderItems-orders, orderItems-products"
  - "Inferred TypeScript types (select + insert) for all tables"
  - "Schema verification script (scripts/verify-schema.ts)"
affects: [01-03, 02-01, 02-02, 03-01, 04-01]

# Tech tracking
tech-stack:
  added: []
  patterns: [schema-as-code, separate-relations-file, inferred-types, numeric-money-fields]

key-files:
  created:
    - "projects/briefs/beads-and-bloom-website/src/db/schema.ts"
    - "projects/briefs/beads-and-bloom-website/src/db/relations.ts"
    - "projects/briefs/beads-and-bloom-website/src/types/index.ts"
    - "projects/briefs/beads-and-bloom-website/scripts/verify-schema.ts"
  modified:
    - "projects/briefs/beads-and-bloom-website/src/db/index.ts"

key-decisions:
  - "numeric(10,2) for all money fields -- exact decimal, no floating point"
  - "Separate relations.ts file to avoid circular imports with schema.ts"
  - "db:push deferred until user configures DATABASE_URL in .env.local"

patterns-established:
  - "Schema-as-code: all tables defined in src/db/schema.ts with Drizzle pgTable"
  - "Relations in separate file: src/db/relations.ts imports from schema.ts"
  - "DB client spreads both schema and relations: drizzle({ client: sql, schema: { ...schema, ...relations } })"
  - "Inferred types: use InferSelectModel/InferInsertModel from drizzle-orm, not manual interfaces"

requirements-completed: []

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 01 Plan 02: Database Schema Summary

**Complete Drizzle schema with 5 tables, 2 enums (including confirmed order status), relations, and inferred TypeScript types for Neon Postgres**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T23:33:18Z
- **Completed:** 2026-03-27T23:36:55Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Full schema with products, customers, orders, orderItems, charityTotals tables using numeric(10,2) for money
- orderStatusEnum includes "confirmed" step for custom orders from day one (avoiding costly retrofit later)
- availabilityEnum distinguishes "ready_to_ship" from "made_to_order"
- Relations connecting orders to customers, orderItems to orders, and orderItems to products
- Inferred TypeScript types (select + insert) and shared Address type for use across the app
- Schema verification script that checks all 5 tables and confirms "confirmed" enum value exists

## Task Commits

Each task was committed atomically:

1. **Task 1: Create database schema with all tables, enums, and relations** - `4d108d6` (feat)
2. **Task 2: Create TypeScript types and push schema to Neon database** - `90bfc21` (feat)

## Files Created/Modified
- `src/db/schema.ts` - All 5 table definitions + orderStatusEnum + availabilityEnum with jsonb typed fields
- `src/db/relations.ts` - Drizzle relation definitions (ordersRelations, orderItemsRelations, customersRelations)
- `src/db/index.ts` - Updated to import and spread both schema and relations into drizzle client
- `src/types/index.ts` - Inferred select/insert types, OrderStatus/Availability enum types, Address type
- `scripts/verify-schema.ts` - Smoke test that connects to Neon and verifies all tables + enums exist

## Decisions Made
- Used numeric(10,2) for all money fields -- Postgres numeric is exact, Drizzle returns as string, convert at display layer
- Kept relations in separate file from schema to avoid circular dependency issues (Drizzle best practice)
- Deferred db:push until user configures DATABASE_URL -- schema files compile clean and are ready to push

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type errors in verify-schema.ts**
- **Found during:** Task 2
- **Issue:** Neon query returns `Record<string, any>[]` but plan code used explicit type annotations in `.map()` and `.some()` callbacks, causing TS2345 errors
- **Fix:** Changed to use implicit typing with `as string` cast on map output instead of parameter type annotations
- **Files modified:** scripts/verify-schema.ts
- **Verification:** `tsc --noEmit --skipLibCheck` passes clean
- **Committed in:** 90bfc21 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type fix for correctness. No scope creep.

## Issues Encountered
- `db:push` cannot run without DATABASE_URL configured in .env.local -- this is expected and documented in the plan. User must create a Neon project and add their connection string before migrations can push.
- `tsc --noEmit` without `--skipLibCheck` shows errors in drizzle-orm and @neondatabase/serverless type definitions (gel-core stubs, pg type conflicts). These are upstream issues in the library types, not in project source code. All source files compile cleanly.

## User Setup Required

Before schema can be pushed to Neon:
1. Create a Neon project at https://console.neon.tech
2. Copy the connection string from Connection Details
3. Add `DATABASE_URL=postgresql://...` to `.env.local`
4. Run `node node_modules/drizzle-kit/bin.cjs push` (or `npm run db:push` if npm shims work)
5. Verify with `node node_modules/tsx/dist/cli.mjs scripts/verify-schema.ts`

## Known Stubs

None -- all schema definitions are complete with real column types, constraints, and relations.

## Next Phase Readiness
- Schema is fully defined and TypeScript-verified, ready for db:push once DATABASE_URL is configured
- Types are exported and available for import across the app via `@/types`
- Relations enable Drizzle query API (e.g., `db.query.orders.findMany({ with: { customer: true, items: true } })`)
- Plan 01-03 (seed script) can import from schema.ts to insert product data

## Self-Check: PASSED

All 5 created/modified files verified on disk. Both task commits (4d108d6, 90bfc21) found in git log.

---
*Phase: 01-foundation*
*Completed: 2026-03-27*
