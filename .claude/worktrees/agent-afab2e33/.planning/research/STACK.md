# Stack Research

**Domain:** Small-batch handmade jewelry e-commerce
**Researched:** 2026-03-27
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (stable LTS) | Full-stack React framework | Industry standard for e-commerce in 2026. App Router with Server Components gives fast page loads critical for Instagram-to-checkout conversion. Server Actions eliminate the need for separate API routes for Stripe checkout. Turbopack stable in 16 but 15.x is battle-tested and has widest ecosystem support. **Confidence: HIGH** |
| React | 19.x | UI library | Ships with Next.js 15. Server Components reduce client JS bundle, critical for mobile-first. React Compiler (stable in 16) auto-memoizes but 19 is plenty for this scale. **Confidence: HIGH** |
| TypeScript | 5.x | Type safety | Non-negotiable for Stripe integration and database schemas. Catches payment-related bugs at compile time. **Confidence: HIGH** |
| Tailwind CSS | 4.x | Styling | CSS-first config (no tailwind.config.js), 5x faster builds. shadcn/ui requires it. Mobile-first utility classes make responsive design natural. **Confidence: HIGH** |
| shadcn/ui | CLI v4 (March 2026) | Component library | Not a dependency -- copies accessible, customizable components into your project. Built on Radix UI primitives. Pre-built components for cards, dialogs, tables, badges, and forms cover 90% of the admin dashboard and storefront needs. **Confidence: HIGH** |

### Database & ORM

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Neon Postgres | (managed) | Database | Serverless Postgres with generous free tier: 0.5GB storage, 100 CU-hours/month. Scale-to-zero means zero cost when the store is idle (most of the day for a small brand). Standard Postgres -- no vendor lock-in. Branching for safe schema changes. **Confidence: HIGH** |
| Drizzle ORM | 0.45.x | Database ORM | SQL-like TypeScript API with zero dependencies (7.4kb). No code generation step (unlike Prisma's `prisma generate`), works instantly with Turbopack hot reload. Edge-compatible out of the box. Drizzle Kit handles migrations. For 13-year-old founders who won't be touching the ORM directly, the simpler mental model doesn't matter -- what matters is it's faster, lighter, and has no cold-start penalty on serverless. **Confidence: HIGH** |

### Payments

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Stripe Checkout (Embedded) | Latest | Payment processing | Project requirement. Embedded Checkout keeps customers on the Beads & Bloom domain (better trust for a teen brand) while Stripe handles PCI compliance. Use Server Actions (not API routes) for session creation -- cleaner code, automatic loading states. Webhooks handle order confirmation. **Confidence: HIGH** |
| stripe (Node SDK) | ^17.x | Server-side Stripe API | Official SDK. Handles checkout session creation, webhook signature verification, and payment intent retrieval. **Confidence: HIGH** |
| @stripe/stripe-js | ^5.x | Client-side Stripe | Loads Stripe.js for Embedded Checkout component. **Confidence: HIGH** |

### Notifications

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Resend | ^4.x | Email notifications | Developer-first email API with first-class Next.js support. Free tier: 100 emails/day (3,000/month) -- more than enough for order notifications at this scale. React Email lets you build order confirmation templates as React components. **Confidence: HIGH** |
| React Email | ^3.x | Email templates | Build order confirmation, shipping update, and custom request emails as React components. Type-safe, version-controlled, reusable. **Confidence: HIGH** |
| Twilio | ^5.x | SMS notifications | Industry standard for programmatic SMS. Founders want SMS for "never miss an order" redundancy. Pay-per-message (~$0.0079/SMS in US). More complex and expensive than alternatives but most reliable and best documented. For 5-10 orders/day, cost is negligible (<$3/month). **Confidence: MEDIUM** -- Twilio is mature but consider starting with email-only and adding SMS in a later phase to reduce initial complexity. |

### Image Handling

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Cloudinary | (managed) | Product image hosting & optimization | Free tier: 25GB storage, 25GB bandwidth/month. Auto-optimizes images by device/browser (critical for mobile-first). Responsive image transforms via URL parameters -- no build-time image processing needed. next-cloudinary package provides CldImage component for automatic optimization. **Confidence: HIGH** |
| next-cloudinary | ^6.x | Cloudinary + Next.js integration | Drop-in CldImage component replaces next/image with Cloudinary-powered optimization. Admin uploads product photos, Cloudinary handles resizing/format/quality automatically. **Confidence: MEDIUM** |

### Hosting & Deployment

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vercel Pro | — | Hosting & deployment | Best-in-class Next.js hosting (they build it). Git push to deploy. Edge functions, image optimization, analytics built in. **Important: Vercel Hobby (free) plan prohibits commercial use. E-commerce requires Pro at $20/month.** This is the only monthly cost besides domain registration. **Confidence: HIGH** |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.x | Schema validation | Validate all form inputs (checkout, custom color requests, admin forms). Integrates with Server Actions for type-safe form handling. Always use -- never trust client input. |
| zustand | ^5.x | Client state management | Lightweight store for shopping cart state. 1kb, no boilerplate. Only needed for cart -- most state lives server-side. |
| lucide-react | ^0.460+ | Icons | Icon set used by shadcn/ui. Consistent, tree-shakeable. |
| date-fns | ^4.x | Date formatting | Format order dates, "shipped 2 days ago" relative times. Lightweight, tree-shakeable (unlike moment.js). |
| sonner | ^2.x | Toast notifications | Lightweight toast library used by shadcn/ui for admin notifications ("New order!", "Status updated"). |
| @tanstack/react-table | ^8.x | Data tables | Admin order list and customer database tables. Sorting, filtering, pagination built in. shadcn/ui has a pre-built data-table pattern using this. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Drizzle Kit | Database migrations | `drizzle-kit push` for dev, `drizzle-kit migrate` for production. Schema-as-code approach. |
| Stripe CLI | Local webhook testing | `stripe listen --forward-to localhost:3000/api/webhook` for testing payment flows locally. Essential for development. |
| ESLint + Prettier | Code quality | Next.js ships with ESLint config. Add Prettier for consistent formatting. |
| dotenv | Environment variables | Stripe keys, Neon connection string, Resend API key, Twilio credentials. Use `.env.local` (gitignored). |

## Installation

```bash
# Core framework
npx create-next-app@latest beads-and-bloom-website --typescript --tailwind --eslint --app --src-dir

# UI components (run inside project directory)
npx shadcn@latest init
npx shadcn@latest add button card dialog input label table badge select textarea tabs toast

# Database
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# Payments
npm install stripe @stripe/stripe-js

# Notifications
npm install resend react-email @react-email/components
npm install twilio

# Image handling
npm install next-cloudinary

# Supporting libraries
npm install zod zustand lucide-react date-fns sonner @tanstack/react-table

# Dev tools
npm install -D prettier eslint-config-prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js 15 | Next.js 16 | If starting after May 2026 when the 16.x ecosystem is fully mature. 15.x is the safer choice today with more tutorials, examples, and community support. |
| Drizzle ORM | Prisma 7 | If the team grows and wants a more abstracted, schema-first approach. Prisma has better docs and larger community but adds cold-start latency and requires a code generation step. |
| Neon Postgres | Supabase | If you want auth, file storage, and realtime bundled in. Supabase is a full BaaS. Overkill here -- we only need a database, and Neon's free tier is more generous for pure Postgres. |
| Neon Postgres | SQLite (Turso) | If you want even simpler setup and zero network latency. But Postgres is the industry standard, and Neon's serverless Postgres works identically to any other Postgres -- easier to find help and hire for. |
| Cloudinary | UploadThing | If you want a simpler upload-only solution. But Cloudinary's automatic image optimization (responsive transforms, format conversion, quality adjustment) is critical for mobile-first e-commerce. Product photos must load fast on 4G connections. |
| Resend | SendGrid | If you need high-volume email marketing later. Resend is purpose-built for transactional email with a better DX. SendGrid's free tier (100 emails/day) is similar but the API is older and more complex. |
| Twilio | Telnyx | If SMS costs become a concern at higher volume. Telnyx is ~50% cheaper per message. At Beads & Bloom's scale (<30 SMS/day), the cost difference is negligible and Twilio's docs are far better. |
| Vercel Pro ($20/mo) | Netlify Free | If budget is the top priority. Netlify's free tier allows commercial use (unlike Vercel Hobby). Next.js works on Netlify but with slightly worse DX -- Vercel is built by the Next.js team. Consider Netlify if $20/month is too much at launch. |
| Vercel Pro ($20/mo) | Cloudflare Pages Free | If you want zero hosting cost. Generous free tier with unlimited bandwidth and commercial use allowed. However, Next.js support on Cloudflare requires the OpenNext adapter, which adds complexity and doesn't support all Next.js features. Not recommended for a first project. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Shopify / WooCommerce / Squarespace | Overkill for this scale, monthly fees, limited customization. The founders want a custom site, not a template store. Shopify's cheapest plan ($39/mo) costs more than the entire recommended stack. | Next.js custom build |
| MongoDB / Mongoose | Document databases are wrong for e-commerce. Orders, customers, products, and fulfillment have clear relationships. Relational data demands a relational database. | Neon Postgres + Drizzle |
| Prisma (for this project) | Code generation step slows DX. Larger bundle. Cold-start penalty on serverless. The team won't be writing raw ORM queries -- it's all behind Server Actions. Drizzle's lighter footprint is better here. | Drizzle ORM |
| NextAuth.js / Auth.js | No customer accounts in v1 (guest checkout only). Admin auth is just the two founders -- a simple password-protected route or Vercel password protection is sufficient. Don't add auth complexity that isn't needed. | Simple middleware-based admin auth (shared password or Vercel password protection) |
| Redux / Context API for cart | Redux is massive overkill. Context API causes unnecessary re-renders. Cart is the only client state needed. | Zustand (1kb, no boilerplate) |
| Moment.js | Massive bundle size (300kb+), deprecated by its own maintainers. | date-fns (tree-shakeable, modern) |
| Styled Components / CSS Modules | Adds runtime overhead (styled-components) or loses the utility-class speed of Tailwind. shadcn/ui requires Tailwind. | Tailwind CSS v4 |
| Payload CMS | Excellent CMS but overkill for this project. Adds significant complexity (embedded admin UI, content modeling, plugin system). The admin dashboard here is simple: manage products and track orders. A custom admin with shadcn/ui components is simpler and more maintainable for this scope. | Custom admin pages with shadcn/ui |
| Firebase / Supabase BaaS | These are full backend-as-a-service platforms. Beads & Bloom needs a database and a few API integrations, not a platform. Using a BaaS creates vendor lock-in and hides the SQL layer that's straightforward with Drizzle. | Neon Postgres + Next.js Server Actions |

## Stack Patterns

**Mobile-first e-commerce from Instagram:**
- Every page must score 90+ on Lighthouse Mobile
- Use Server Components for product catalog (zero client JS for browsing)
- Embed Stripe Checkout to avoid redirect (keeps trust, reduces drop-off)
- Cloudinary responsive images with automatic WebP/AVIF for fast loading on 4G
- Cart state in Zustand persisted to localStorage (survives page refresh)

**Simple admin for teen founders:**
- Admin is password-protected pages at `/admin/*`, not a separate app
- shadcn/ui data tables for order list with status badges and filters
- One-click status updates (New -> Making -> Shipped -> Delivered)
- Real-time toast notifications when orders come in (via polling or Server-Sent Events)
- Product management: add/edit/remove with image upload to Cloudinary

**Charity donation counter:**
- Store cumulative donation amount in database
- Increment by $1 on each successful Stripe webhook
- Display on homepage with a simple counter component
- Server Component -- no client JS needed, updates on page load

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 15.x | React 19.x | Bundled together. Do not mix React versions. |
| Tailwind CSS 4.x | shadcn/ui CLI v4 | shadcn CLI v4 (March 2026) uses Tailwind v4 CSS-first config. Ensure you use the latest shadcn init. |
| Drizzle ORM 0.45.x | @neondatabase/serverless | Use Neon's serverless driver (HTTP-based) for edge compatibility. Do not use node-postgres (pg) -- it doesn't work on edge/serverless. |
| stripe ^17.x | @stripe/stripe-js ^5.x | Server SDK and client library must be from the same era. Check Stripe's changelog if upgrading either. |
| shadcn/ui (March 2026) | radix-ui (unified package) | New-york style uses single `radix-ui` package instead of individual `@radix-ui/react-*` packages. Cleaner deps. |

## Monthly Cost Estimate

| Service | Free Tier | Paid Tier | When to Upgrade |
|---------|-----------|-----------|-----------------|
| Vercel Pro | N/A (commercial requires Pro) | $20/month | Day 1 -- required for e-commerce |
| Neon Postgres | 0.5GB storage, 100 CU-hours | $19/month (Launch plan) | When storage exceeds 0.5GB or traffic needs consistent compute |
| Stripe | 2.9% + $0.30 per transaction | Same | No upgrade needed -- pay per transaction |
| Resend | 100 emails/day (3,000/month) | $20/month | When order volume exceeds ~100/day |
| Twilio | None (pay-per-use) | ~$0.0079/SMS + $1/month phone number | Cost from day 1, but minimal at low volume |
| Cloudinary | 25GB storage, 25GB bandwidth | $89/month (Plus) | When product catalog images exceed free tier |
| **Total at launch** | | **~$21-22/month** | Vercel Pro + Twilio phone number |

**Note for Netlify alternative:** If $20/month for Vercel Pro is a concern for teen founders just starting out, Netlify's free tier allows commercial use with 100GB bandwidth. The trade-off is slightly worse Next.js DX. This brings launch cost to ~$1-2/month (just Twilio). Mention this to the founders as an option.

## Sources

- [Next.js 16 blog post](https://nextjs.org/blog/next-16) -- confirmed 16 is stable with Turbopack, but 15.x remains well-supported (HIGH confidence)
- [Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15) -- still receiving updates as of March 2026 (HIGH confidence)
- [Stripe Checkout quickstart for Next.js](https://docs.stripe.com/checkout/quickstart?client=next) -- official Stripe docs for embedded checkout (HIGH confidence)
- [Stripe + Next.js 15 complete guide](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/) -- Server Actions pattern for checkout (MEDIUM confidence)
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) -- official integration guide (HIGH confidence)
- [Neon pricing page](https://neon.com/pricing) -- free tier limits verified (HIGH confidence)
- [Neon free plan guide](https://neon.com/blog/how-to-make-the-most-of-neons-free-plan) -- 100 CU-hours after Databricks acquisition (HIGH confidence)
- [Drizzle ORM + PostgreSQL docs](https://orm.drizzle.team/docs/get-started-postgresql) -- Neon driver setup (HIGH confidence)
- [Drizzle vs Prisma 2026 comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma) -- performance and DX analysis (MEDIUM confidence)
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- March 2026 release (HIGH confidence)
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, performance improvements (HIGH confidence)
- [Vercel Hobby plan docs](https://vercel.com/docs/plans/hobby) -- commercial use restriction confirmed (HIGH confidence)
- [Netlify free plan commercial use](https://answers.netlify.com/t/can-we-use-netlify-free-plan-for-commercial-purposes/41545) -- confirmed allowed (HIGH confidence)
- [Cloudinary Next.js integration](https://github.com/cloudinary-community/next-cloudinary) -- next-cloudinary package (HIGH confidence)
- [Payload CMS 3.0 announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app) -- evaluated and rejected for this scope (MEDIUM confidence)

---
*Stack research for: Beads & Bloom handmade jewelry e-commerce*
*Researched: 2026-03-27*
