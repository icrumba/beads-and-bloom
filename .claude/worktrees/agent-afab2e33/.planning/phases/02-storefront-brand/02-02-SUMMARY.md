---
phase: 02-storefront-brand
plan: 02
subsystem: product-catalog
tags: [homepage, product-detail, photo-carousel, category-tabs, seo]
dependency_graph:
  requires: [02-01]
  provides: [homepage, product-detail-page, product-browsing, seo-metadata]
  affects: [02-03, 03-01]
tech_stack:
  added: [next-cloudinary CldImage, CSS scroll-snap carousel, IntersectionObserver]
  patterns: [server-component-data-fetching, url-search-param-filtering, suspense-boundary, responsive-grid-layout]
key_files:
  created:
    - projects/briefs/beads-and-bloom-website/src/components/shop/availability-badge.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shop/color-swatches.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shop/product-card.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shop/product-grid.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shop/category-tabs.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shop/photo-carousel.tsx
    - projects/briefs/beads-and-bloom-website/src/components/shared/hero-section.tsx
    - projects/briefs/beads-and-bloom-website/src/app/products/[slug]/page.tsx
  modified:
    - projects/briefs/beads-and-bloom-website/src/app/page.tsx
decisions:
  - CSS scroll-snap for photo carousel instead of library -- zero dependencies, native swipe on mobile
  - IntersectionObserver for carousel dot indicators -- tracks visible slide without scroll event listeners
  - URL search params for category filtering -- enables shareable filtered URLs and server-side rendering
metrics:
  duration: 7min
  completed: 2026-03-28
---

# Phase 02 Plan 02: Product Catalog Summary

Homepage with hero section, category tabs, featured product, and responsive product grid. Product detail pages with swipeable photo carousel, SEO metadata, and full product info display.

## Tasks Completed

### Task 1: Homepage with hero section, category tabs, and product grid

Built 7 components forming the complete homepage experience:

- **AvailabilityBadge**: Server component rendering "Ready to ship" or "Made to order (5-7 days)" using shadcn Badge with secondary variant
- **ColorSwatches**: Server component rendering hex color dots (12px diameter) with max 5 display and "+N" overflow indicator
- **ProductCard**: Client component (CldImage requires it) wrapping card in Next.js Link, displaying photo, name, price, badge, and swatches with hover lift effect
- **ProductGrid**: Server component with mixed layout -- featured product large on top, remaining in 2/3/4 column responsive grid, with empty state
- **CategoryTabs**: Client component using shadcn Tabs with URL search param filtering for all/bracelets/necklaces/accessories
- **HeroSection**: Server component with brand tagline and charity mission subtitle on sandy background
- **Homepage (page.tsx)**: Server Component fetching products and featured products, rendering hero, tabs (in Suspense), and grid

**Commit:** bcd0e67

### Task 2: Product detail page with photo carousel and SEO metadata

Built the product detail page and photo carousel:

- **PhotoCarousel**: Client component using CSS scroll-snap for swipeable photos with IntersectionObserver-based dot indicators. Handles 0, 1, or multiple images gracefully
- **Product detail page**: Server Component with generateMetadata for dynamic SEO (title, description, OG images via Cloudinary transforms). Responsive layout -- stacked on mobile, side-by-side on tablet+. Displays name, price, availability badge, color swatches, description, materials, care info. Styled "Add to Cart" button (non-functional in Phase 02). Back to Shop navigation link

**Commit:** 2a53951

## Verification

- TypeScript compilation: zero errors (`tsc --noEmit` passes clean)
- Next.js build: compiles successfully (data collection fails as expected -- no DATABASE_URL configured, same as Plan 01)
- All acceptance criteria met for both tasks

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

- **Add to Cart button** (`src/app/products/[slug]/page.tsx`, line ~107): Styled button with no onClick handler. Intentional -- Phase 03 (cart and checkout) will wire this up. Documented in UI-SPEC as "non-functional in Phase 02".

## Self-Check: PASSED

All 9 files verified on disk. Both commits (bcd0e67, 2a53951) verified in git log.
