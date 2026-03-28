---
phase: 02-storefront-brand
plan: 01
subsystem: storefront-foundation
tags: [design-system, layout, queries, shadcn]
dependency_graph:
  requires: [01-01, 01-02, 01-03]
  provides: [brand-colors, shared-layout, product-queries, shadcn-components]
  affects: [02-02, 02-03]
tech_stack:
  added: [Plus Jakarta Sans, shadcn/ui card, shadcn/ui badge, shadcn/ui tabs, shadcn/ui sheet, shadcn/ui separator, shadcn/ui skeleton]
  patterns: [client-component-header, server-component-footer, sheet-based-mobile-nav, drizzle-query-layer]
key_files:
  created:
    - projects/briefs/beads-and-bloom-website/src/components/ui/card.tsx
    - projects/briefs/beads-and-bloom-website/src/components/ui/badge.tsx
    - projects/briefs/beads-and-bloom-website/src/components/ui/tabs.tsx
    - projects/briefs/beads-and-bloom-website/src/components/ui/sheet.tsx
    - projects/briefs/beads-and-bloom-website/src/components/ui/separator.tsx
    - projects/briefs/beads-and-bloom-website/src/components/ui/skeleton.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/header.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/footer.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/mobile-nav.tsx
    - projects/briefs/beads-and-bloom-website/src/lib/queries.ts
  modified:
    - projects/briefs/beads-and-bloom-website/src/app/layout.tsx
    - projects/briefs/beads-and-bloom-website/src/app/globals.css
    - projects/briefs/beads-and-bloom-website/src/app/page.tsx
decisions:
  - Inline SVG for Instagram icon -- lucide-react v1.7 removed Instagram export, used standard SVG path instead
metrics:
  duration: 7min
  completed: 2026-03-28
---

# Phase 02 Plan 01: Design System, Shared Layout & Query Layer Summary

Brand design system with Plus Jakarta Sans font, teal/sand/off-white color palette via CSS variables, shared header/footer/mobile-nav layout, and Drizzle query layer for products and charity counter.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install shadcn components, swap font, apply brand colors | 1ae432c | layout.tsx, globals.css, 6 UI components |
| 2 | Build header, footer, mobile nav, Drizzle queries | 18711bb | header.tsx, footer.tsx, mobile-nav.tsx, queries.ts |

## What Was Built

### Design System (Task 1)
- **Font:** Plus Jakarta Sans (400, 600 weights) replaces Geist Sans as `--font-sans`
- **Colors:** Teal primary (`oklch(0.63 0.09 175)` / #3B9B8F), off-white background (`oklch(0.98 0.002 100)` / #FAFAF8), sandy warm cards (`oklch(0.94 0.012 80)` / #F0EBE3)
- **shadcn components:** card, badge, tabs, sheet, separator, skeleton installed and ready
- **Metadata:** Title and description updated with Beads & Bloom branding

### Shared Layout (Task 2)
- **Header:** Logo left, hamburger right on mobile, inline nav links on desktop (>=768px). 56px height, not sticky (per UI spec D-12).
- **Mobile Nav:** Sheet-based slide-out from right. 4 links (Shop, About, Shipping, Contact) with 48px touch targets and active state indicator using primary teal.
- **Footer:** Sandy warm background, tagline "Handmade with love by twin sisters.", quick links, Instagram link with icon, copyright.
- **Layout wrapper:** Header > main (min-h-screen) > Footer structure in root layout.

### Query Layer (Task 2)
- `getProducts(category?)` -- filters by in-stock, optional category, sorted by sortOrder
- `getProductBySlug(slug)` -- single product lookup by slug
- `getFeaturedProducts()` -- featured + in-stock products
- `getCharityTotal()` -- charity donation counter with fallback default

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Instagram icon not exported from lucide-react v1.7**
- **Found during:** Task 2
- **Issue:** `lucide-react` v1.7+ does not export an `Instagram` icon
- **Fix:** Created inline SVG component `InstagramIcon` using the standard Instagram SVG path
- **Files modified:** `src/components/shared/footer.tsx`
- **Commit:** 18711bb

## Verification

- Build completes without errors (both tasks verified)
- All 6 shadcn components exist in `src/components/ui/`
- Brand colors applied in globals.css `:root` block
- Plus Jakarta Sans configured in layout.tsx
- Header, Footer, MobileNav in `src/components/shared/`
- queries.ts exports 4 Drizzle query functions

## Known Stubs

None -- all components are fully wired. The homepage placeholder text ("Coming soon -- storefront building in progress") is intentional and will be replaced by Plan 02 (product catalog).

## Self-Check: PASSED

- All 10 created files verified on disk
- Both commit hashes (1ae432c, 18711bb) found in git log
- Build passes clean
