---
phase: 02-storefront-brand
plan: 03
subsystem: brand-pages
tags: [brand, about, contact, shipping, returns, charity-counter, instagram]
dependency_graph:
  requires: [02-01]
  provides: [brand-pages, charity-counter, instagram-gallery]
  affects: [homepage]
tech_stack:
  added: []
  patterns: [server-components, intersection-observer, lazy-db-proxy]
key_files:
  created:
    - projects/briefs/beads-and-bloom-website/src/app/about/page.tsx
    - projects/briefs/beads-and-bloom-website/src/app/contact/page.tsx
    - projects/briefs/beads-and-bloom-website/src/app/shipping/page.tsx
    - projects/briefs/beads-and-bloom-website/src/app/returns/page.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/charity-counter.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/instagram-gallery.tsx
  modified:
    - projects/briefs/beads-and-bloom-website/src/app/page.tsx
    - projects/briefs/beads-and-bloom-website/src/db/index.ts
decisions:
  - Inline SVG for Instagram icon (lucide-react removed Instagram export)
  - Lazy DB proxy to prevent build failures when DATABASE_URL is not set
  - force-dynamic on homepage since it fetches charity total from DB
  - Placeholder divs for about page photos (easy CldImage swap later)
metrics:
  duration: 7min
  completed: 2026-03-28
---

# Phase 02 Plan 03: Brand Pages & Homepage Sections Summary

Brand storytelling pages (about, contact, shipping, returns) plus animated charity counter and Instagram gallery on homepage, all using the design system from Plan 02-01.

## Task Commits

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Build about, contact, shipping, and returns pages | `decbdb0` | about/page.tsx, contact/page.tsx, shipping/page.tsx, returns/page.tsx |
| 2 | Build charity counter and Instagram gallery, wire into homepage | `4a498fa` | charity-counter.tsx, instagram-gallery.tsx, page.tsx, db/index.ts |

## What Was Built

### Brand Pages (Task 1)
- **About page** (`/about`): Founder story with 4 alternating photo/text sections. Mobile single-column, desktop side-by-side with `md:flex-row-reverse` for odd sections. Image placeholders ready for CldImage swap.
- **Contact page** (`/contact`): "Say Hi!" heading with email (mailto link) and Instagram DM link in card layout. Inline SVG for Instagram icon per prior decision.
- **Shipping page** (`/shipping`): Flat-rate $5 shipping, processing times, USPS delivery, tracking info in card panels.
- **Returns page** (`/returns`): Promise, 14-day return policy, made-to-order exception, contact instructions in card panels.
- All pages are Server Components (no "use client"), all export SEO metadata.

### Homepage Sections (Task 2)
- **CharityCounter**: Client component with IntersectionObserver-triggered count-up animation. 2-second ease-out cubic easing via requestAnimationFrame. Displays "$X donated and counting!" in teal primary color.
- **InstagramGallery**: Server component with 6 placeholder image slots in 2x2 mobile / 3x2 desktop grid. `GALLERY_IMAGES` const array ready for Cloudinary public IDs. All slots link to Instagram profile.
- **Homepage integration**: Fetches charity total from DB, passes to CharityCounter. Both sections appended below placeholder content with 48px spacing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made DB connection lazy with Proxy pattern**
- **Found during:** Task 2
- **Issue:** `neon()` in db/index.ts throws at import time when DATABASE_URL is missing, which prevented Next.js build from completing (even with try-catch in page.tsx).
- **Fix:** Replaced eager `neon()` call with a Proxy-based lazy initialization pattern. The DB client is only created when a property is accessed (i.e., when a query runs), allowing the module to import without error.
- **Files modified:** src/db/index.ts
- **Commit:** `4a498fa`

## Known Stubs

| File | Line | Stub | Resolution |
|------|------|------|------------|
| about/page.tsx | ImagePlaceholder | Placeholder divs instead of real photos | Swap with CldImage when about page photos uploaded to Cloudinary |
| instagram-gallery.tsx | GALLERY_IMAGES | 6 null entries (placeholder grid) | Replace with Cloudinary public IDs when curated Instagram images available |
| contact/page.tsx | mailto link | beadsandbloom@email.com placeholder | Update with real email when provided by founders |

These stubs are intentional -- the plan specifies placeholders for images not yet available. They do not prevent the plan's goals from being achieved.

## Self-Check: PASSED
