# Phase 5: Polish & Launch - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Performance optimization, error handling, Stripe test validation, and production deployment preparation. No new features — this phase hardens and ships what Phases 1-4 built.

</domain>

<decisions>
## Implementation Decisions

### Performance Optimization
- **D-01:** Audit all pages with Lighthouse mobile. Target 90+ on homepage and product detail pages.
- **D-02:** Ensure all CldImage components have proper `sizes` attributes and responsive format (already partially done in Phase 2).
- **D-03:** Verify Server Components are used for all data-fetching pages (no unnecessary client-side JS).
- **D-04:** Add loading.tsx skeletons for key routes (/products/[slug], /admin/orders, /admin/products) for better perceived performance.
- **D-05:** Ensure next.config.ts has proper image domain configuration for Cloudinary.

### Error Handling
- **D-06:** Global error.tsx at app root for unhandled exceptions — friendly message + "Try again" button.
- **D-07:** Not-found.tsx at app root for 404s — branded page with link back to shop.
- **D-08:** Route-level error.tsx for critical paths: /checkout, /order/confirmation, /admin.
- **D-09:** Stripe-specific errors: show clear messages for declined card, expired session, network failure. No raw error codes shown to users.
- **D-10:** Image load failures: product cards already have fallback placeholders (Phase 2). Verify they work for all image components.
- **D-11:** Empty cart checkout attempt: redirect to homepage with toast "Your cart is empty."
- **D-12:** Database connection failures: show "We're having trouble loading. Please try again in a moment." — not a stack trace.

### Deployment Preparation
- **D-13:** Create comprehensive .env.example with all required environment variables documented with comments.
- **D-14:** Create deployment guide document listing: Vercel setup, env vars to configure, Stripe webhook URL, Neon database connection, Cloudinary config, Resend API key, admin password.
- **D-15:** Ensure all sensitive values (API keys, passwords) are in environment variables, not hardcoded.
- **D-16:** Add proper meta tags for social sharing (OG images, Twitter cards) on homepage and product pages.

### Claude's Discretion
- Specific loading skeleton designs
- Error message copy details
- Whether to add a simple health check endpoint
- Any minor CSS polish needed

</decisions>

<canonical_refs>
## Canonical References

### Existing Code
- `projects/briefs/beads-and-bloom-website/next.config.ts` — Next.js config to audit
- `projects/briefs/beads-and-bloom-website/src/app/layout.tsx` — root layout for error boundaries
- `projects/briefs/beads-and-bloom-website/src/app/page.tsx` — homepage to audit
- `projects/briefs/beads-and-bloom-website/src/app/products/[slug]/page.tsx` — PDP to audit
- `projects/briefs/beads-and-bloom-website/src/app/checkout/page.tsx` — checkout to add error handling

### Tech Stack
- `CLAUDE.md` §Technology Stack — Vercel Pro deployment, environment variable patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### What's Already Good
- Server Components used for all data-fetching pages
- CldImage with format="auto" and quality="auto" on all product images
- CSS scroll-snap carousel (zero JS library overhead)
- Zustand hydration-safe hook prevents SSR mismatches

### What Needs Attention
- No error.tsx or not-found.tsx files exist yet
- No loading.tsx skeleton files for routes
- .env.example may be incomplete after 4 phases of additions
- Empty cart checkout edge case not handled
- No global error boundary

</code_context>

<specifics>
## Specific Ideas

- This is the last phase before real customers use the site
- Founders will share Instagram links that deep-link to products — those pages must load fast and look good in link previews
- The site should feel polished even when things go wrong (errors, slow connections)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-polish-launch*
*Context gathered: 2026-03-28*
