# Phase 2: Storefront & Brand - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Mobile-first product browsing experience and brand storytelling pages. Customers arriving from Instagram can browse all products, learn the Beads & Bloom story, and understand the charity mission. No cart or checkout — that's Phase 3.

Requirements: STORE-01, STORE-02, STORE-06, STORE-07, STORE-08, STORE-10, BRAND-01, BRAND-02, BRAND-03, BRAND-04

</domain>

<decisions>
## Implementation Decisions

### Product Browsing Layout
- **D-01:** Mixed layout on homepage — featured product displayed large on top, then 2-column grid below
- **D-02:** Product cards show: photo, name, price, made-to-order badge, and color swatches (small dots)
- **D-03:** Category tabs for filtering: All / Bracelets / Necklaces / Accessories
- **D-04:** Product detail page uses side-by-side layout on tablet (photos left, info right) that stacks to photo-on-top on mobile
- **D-05:** Product detail page includes swipeable photo carousel, name, price, description, materials, care info

### Brand Storytelling
- **D-06:** About page uses photo-driven narrative — alternating sections of photos (twins making jewelry, ocean/charms) and text (mission, charity info)
- **D-07:** Homepage charity donation counter is animated — number counts up on page load ("$247 donated and counting!")
- **D-08:** Counter auto-calculates from completed orders in database

### Visual Design
- **D-09:** Color palette: white/off-white background, soft teal/ocean blue accent for buttons and highlights, sandy/warm neutral for secondary elements
- **D-10:** Typography: clean sans-serif (Inter or Plus Jakarta Sans) — modern, readable, lets jewelry be the visual star
- **D-11:** Product photos: white background for consistency and professionalism

### Mobile Navigation & Structure
- **D-12:** Minimal header — logo and menu icon at top, not sticky. More screen space for products.
- **D-13:** Menu reveals: Shop, About, Shipping, Contact
- **D-14:** Homepage flow: hero image/banner with tagline → featured product → product grid → charity counter woven in

### Claude's Discretion
- Image carousel implementation approach (Embla, Swiper, or native scroll-snap)
- Exact animation library for charity counter (Framer Motion, CSS, or count-up library)
- shadcn/ui component selection for cards, badges, tabs
- SEO metadata structure and OG image generation approach
- Responsive breakpoints for tablet side-by-side layout
- Static page implementation for shipping/return policy (MDX vs hardcoded)
- Instagram feed integration method (embedded feed widget vs curated image gallery)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Database Schema
- `projects/briefs/beads-and-bloom-website/src/db/schema.ts` — Product table structure, category enum, availability enum
- `projects/briefs/beads-and-bloom-website/src/types/index.ts` — TypeScript types for products, orders

### Project Stack
- `.planning/research/STACK.md` — Technology decisions (Next.js 15, Tailwind CSS 4, shadcn/ui, Cloudinary)
- `.planning/research/ARCHITECTURE.md` — Component structure, route groups

### Brand Context
- `brand_context/voice-profile.md` — Brand voice for all copy (warm, charming teens that impress adults)
- `brand_context/positioning.md` — "The Feel-Good Purchase" angle
- `brand_context/icp.md` — Target audience: moms/aunts 25-45, daughters/nieces 8-15

### Phase 1 Foundation
- `.planning/phases/01-foundation/01-01-SUMMARY.md` — Scaffold details, Windows path workaround
- `.planning/phases/01-foundation/01-02-SUMMARY.md` — Schema details

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/button.tsx` — shadcn/ui Button component (only UI component installed so far)
- `src/lib/utils.ts` — cn() utility for Tailwind class merging
- `src/db/index.ts` — DB client singleton with neon-http driver (use for charity counter query)
- `src/db/schema.ts` — Products table with all fields needed for catalog display

### Established Patterns
- Tailwind CSS 4 with CSS-first config (no tailwind.config.js)
- shadcn/ui for component library — install more components as needed via `npx shadcn@latest add`
- Next.js App Router with `src/app/` directory
- Drizzle ORM for database queries
- dotenv loads from `.env.local` (not `.env`) — fixed in Phase 1

### Integration Points
- `src/app/page.tsx` — Currently placeholder, becomes the homepage
- `src/app/layout.tsx` — Root layout, add navigation here
- New routes needed: `/products/[slug]`, `/about`, `/shipping`, `/returns`, `/contact`
- Cloudinary URLs stored in products table `images` column (JSON array of public IDs)

### Windows Path Workaround
- npm scripts may fail due to `&` in "Beads & Bloom" path
- Use `node node_modules/...` directly instead of `npx`

</code_context>

<specifics>
## Specific Ideas

- Product cards should feel Instagram-worthy — clean white photos with just enough info to tap through
- The charity counter animation should feel genuine and exciting, not gimmicky
- About page photos should alternate: twins making jewelry → close-up of ocean charms → twins packaging orders → ocean scene
- "Made to order (5-7 days)" badge should be subtle but clear — not alarming, just informative
- Color swatches on product cards should be small and tasteful, not overwhelming

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-storefront-brand*
*Context gathered: 2026-03-28*
