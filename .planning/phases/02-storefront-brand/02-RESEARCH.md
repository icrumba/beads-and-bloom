# Phase 2: Storefront & Brand - Research

**Researched:** 2026-03-27
**Domain:** Mobile-first product catalog, brand pages, Next.js Server Components with Drizzle ORM
**Confidence:** HIGH

## Summary

Phase 2 transforms the placeholder homepage into a full storefront and brand presence. The core work is: (1) a mobile-responsive product grid with category tabs and detail pages, (2) brand storytelling pages (About, Contact, Shipping, Returns), (3) an animated charity counter, and (4) SEO metadata for all pages. All product data already exists in Neon Postgres via the seed script from Phase 1 (8 products across 3 categories). The UI-SPEC provides exact color values, typography, spacing, component inventory, and copy.

The architecture is Server Component-first -- product browsing has zero client JS except for the photo carousel, category tabs interaction, mobile nav, and charity counter animation. Cloudinary handles all image optimization via the next-cloudinary CldImage component. The font must change from Geist Sans to Plus Jakarta Sans (weights 400 and 600). The shadcn default neutral palette must be overridden with the brand colors defined in the UI-SPEC.

**Primary recommendation:** Build in layers -- design system (font, colors, CSS variables) first, then shared layout (header, footer, mobile nav), then product pages (grid, cards, detail), then brand pages (about, contact, shipping, returns), then SEO metadata and charity counter last.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Mixed layout on homepage -- featured product displayed large on top, then 2-column grid below
- **D-02:** Product cards show: photo, name, price, made-to-order badge, and color swatches (small dots)
- **D-03:** Category tabs for filtering: All / Bracelets / Necklaces / Accessories
- **D-04:** Product detail page uses side-by-side layout on tablet (photos left, info right) that stacks to photo-on-top on mobile
- **D-05:** Product detail page includes swipeable photo carousel, name, price, description, materials, care info
- **D-06:** About page uses photo-driven narrative -- alternating sections of photos and text
- **D-07:** Homepage charity donation counter is animated -- number counts up on page load
- **D-08:** Counter auto-calculates from completed orders in database
- **D-09:** Color palette: white/off-white background, soft teal/ocean blue accent, sandy/warm neutral secondary
- **D-10:** Typography: Plus Jakarta Sans, modern, readable
- **D-11:** Product photos: white background for consistency
- **D-12:** Minimal header -- logo and menu icon at top, not sticky
- **D-13:** Menu reveals: Shop, About, Shipping, Contact
- **D-14:** Homepage flow: hero image/banner with tagline -> featured product -> product grid -> charity counter

### Claude's Discretion
- Image carousel implementation approach (CSS scroll-snap recommended -- see research below)
- Exact animation for charity counter (lightweight count-up with IntersectionObserver -- see research below)
- shadcn/ui component selection for cards, badges, tabs (specified in UI-SPEC)
- SEO metadata structure and OG image generation approach
- Responsive breakpoints for tablet side-by-side layout
- Static page implementation for shipping/return policy (hardcoded JSX recommended -- see research below)
- Instagram feed integration method (curated image gallery recommended -- see research below)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STORE-01 | User can browse products in a mobile-responsive grid catalog | Product grid with 2-col mobile / 3-col tablet / 4-col desktop, category tabs for filtering, Drizzle queries for product data |
| STORE-02 | User can view product detail page with photos, description, price, materials, and care info | Dynamic route `/products/[slug]`, CSS scroll-snap photo carousel, all fields exist in products table schema |
| STORE-06 | User can view flat-rate shipping info page | Static `/shipping` page with hardcoded copy from UI-SPEC |
| STORE-07 | User can view return/refund policy page | Static `/returns` page with hardcoded copy |
| STORE-08 | Product pages have SEO metadata (title tags, descriptions, OG images) | `generateMetadata` for dynamic pages, static metadata for fixed pages, CldOgImage or Cloudinary URL transforms for OG images |
| STORE-10 | Products display "Ready to ship" vs "Made to order (5-7 days)" flags | AvailabilityBadge component reading `availability` enum from products table |
| BRAND-01 | About page tells the founder story | `/about` page with alternating photo/text sections, copy from UI-SPEC |
| BRAND-02 | Homepage displays running charity donation counter | CharityCounter component querying `charity_totals` table, count-up animation with IntersectionObserver |
| BRAND-03 | Contact page with email and Instagram DM link | Static `/contact` page with copy from UI-SPEC |
| BRAND-04 | Instagram feed or curated gallery on homepage | Curated static image gallery linking to Instagram profile (no embed widget -- simpler, faster, no third-party JS) |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.14 | Framework | Already installed. App Router with Server Components for zero-JS product browsing. |
| React | 19.1.0 | UI library | Already installed. Server Components reduce client bundle. |
| Tailwind CSS | 4.x | Styling | Already installed. CSS-first config, responsive utilities. |
| shadcn/ui | 4.1.1 | Component library | Already initialized. Install additional components (card, badge, tabs, sheet, separator, skeleton). |
| Drizzle ORM | 0.45.2 | Database queries | Already installed. Use `db.select()` for product queries. |
| next-cloudinary | 6.17.5 | Image optimization | Already installed. CldImage for responsive product photos. |
| lucide-react | 1.7.0 | Icons | Already installed. Menu, X, ChevronLeft, ChevronRight, Instagram, Mail icons. |

### New Dependencies Needed

| Library | Version | Purpose | Install Command |
|---------|---------|---------|-----------------|
| Plus Jakarta Sans | (Google Font) | Brand typography | Via `next/font/google` -- no npm install needed |

**No new npm packages required.** The UI-SPEC specifies CSS scroll-snap for the carousel (native browser), IntersectionObserver for the charity counter (native browser API), and shadcn/ui components for the rest. This is intentional -- keep the bundle minimal.

### shadcn Components to Install

```bash
npx shadcn@latest add card badge tabs sheet separator skeleton
```

**Windows workaround note:** If `npx` fails due to the `&` in the path, use `node node_modules/shadcn/dist/bin.js add card badge tabs sheet separator skeleton` from the project directory.

### Alternatives Considered

| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| CSS scroll-snap carousel | Embla Carousel / Swiper | Adds dependency, extra JS. CSS scroll-snap is native, zero-JS, mobile-optimized, and has full browser support. Dot indicators can be done with scroll position + IntersectionObserver. |
| IntersectionObserver count-up | Framer Motion / react-countup | Both add bundle weight. A simple `requestAnimationFrame` loop triggered by IntersectionObserver is ~20 lines of code and zero dependencies. |
| Hardcoded JSX for policy pages | MDX | MDX adds build complexity for two static pages that will rarely change. Hardcoded JSX with Tailwind prose is simpler and faster. |
| Curated image gallery for Instagram | Instagram embed widget | Embeds load third-party JS, are slow, break frequently, and require API tokens. A curated gallery of 4-6 Cloudinary-hosted images linking to the Instagram profile is faster, more reliable, and on-brand. |

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── app/
│   ├── layout.tsx              # UPDATE: Plus Jakarta Sans, brand metadata
│   ├── globals.css             # UPDATE: Brand color CSS variable overrides
│   ├── page.tsx                # REPLACE: Full homepage (hero, featured, grid, counter)
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx        # NEW: Product detail page
│   ├── about/
│   │   └── page.tsx            # NEW: About/story page
│   ├── shipping/
│   │   └── page.tsx            # NEW: Shipping info
│   ├── returns/
│   │   └── page.tsx            # NEW: Returns policy
│   └── contact/
│       └── page.tsx            # NEW: Contact page
├── components/
│   ├── ui/                     # shadcn components (card, badge, tabs, etc.)
│   ├── shop/                   # Product-specific components
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── photo-carousel.tsx
│   │   ├── category-tabs.tsx
│   │   ├── color-swatches.tsx
│   │   └── availability-badge.tsx
│   └── shared/                 # Cross-cutting components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── mobile-nav.tsx
│       ├── hero-section.tsx
│       ├── charity-counter.tsx
│       ├── about-section.tsx
│       └── instagram-gallery.tsx
└── lib/
    ├── utils.ts                # EXISTS: cn() utility
    └── queries.ts              # NEW: Drizzle product/charity queries
```

### Pattern 1: Server Components for Product Data

**What:** All product listing and detail pages are Server Components. Data is fetched directly in the component with Drizzle -- no API routes, no client-side fetching.

**When to use:** Every page that reads product data.

**Example:**
```typescript
// src/lib/queries.ts
import { db } from "@/db";
import { products, charityTotals } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getProducts(category?: string) {
  if (category && category !== "all") {
    return db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(asc(products.sortOrder));
  }
  return db.select().from(products)
    .orderBy(asc(products.sortOrder));
}

export async function getProductBySlug(slug: string) {
  const result = await db.select().from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getCharityTotal() {
  const result = await db.select().from(charityTotals).limit(1);
  return result[0] ?? { totalDonated: "0", orderCount: 0 };
}

export async function getFeaturedProducts() {
  return db.select().from(products)
    .where(eq(products.featured, true))
    .orderBy(asc(products.sortOrder));
}
```

### Pattern 2: Client Components Only Where Needed

**What:** Mark components as `"use client"` only when they need browser APIs (IntersectionObserver, scroll events, touch events) or user interaction state.

**Client components in this phase:**
- `PhotoCarousel` -- needs CSS scroll-snap and optional dot indicator state
- `CategoryTabs` -- needs URL search param updates or client-side filtering
- `CharityCounter` -- needs IntersectionObserver + requestAnimationFrame
- `MobileNav` -- needs Sheet open/close state (shadcn Sheet is already client)
- `Header` -- needs mobile nav toggle state

**Everything else is a Server Component.**

### Pattern 3: Category Filtering via URL Search Params

**What:** Use URL search params (`?category=bracelets`) for category filtering instead of client-side state. This keeps the product list as a Server Component, enables shareable URLs, and supports browser back/forward.

**Example:**
```typescript
// src/app/page.tsx (Server Component)
import { getProducts, getFeaturedProducts } from "@/lib/queries";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid } from "@/components/shop/product-grid";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "all";
  const products = await getProducts(activeCategory);
  const featured = await getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <CategoryTabs active={activeCategory} />
      <ProductGrid products={products} featured={featured[0]} />
      <CharityCounter />
    </>
  );
}
```

```typescript
// src/components/shop/category-tabs.tsx ("use client")
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["all", "bracelets", "necklaces", "accessories"];

export function CategoryTabs({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.push(`/?${params.toString()}`);
  }

  return (
    <Tabs value={active} onValueChange={handleChange}>
      <TabsList>
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="capitalize">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

### Pattern 4: CldImage for All Product Photos

**What:** Use next-cloudinary's CldImage component for all product images. Store Cloudinary public IDs in the database (already done in seed data), transform via URL params at render time.

**Example:**
```typescript
// CldImage requires "use client" in App Router
"use client";
import { CldImage } from "next-cloudinary";

export function ProductImage({
  publicId,
  alt,
  width,
  height,
}: {
  publicId: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      alt={alt}
      crop="fill"
      gravity="center"
      format="auto"
      quality="auto"
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
}
```

**Important:** CldImage is a client component wrapper. The parent (ProductCard, ProductGrid) can still be a Server Component -- just the image rendering happens client-side. The `sizes` prop is critical for responsive image loading on mobile.

### Pattern 5: CSS Scroll-Snap Photo Carousel

**What:** Native CSS scroll-snap for the product detail photo carousel. Zero JavaScript for the core scrolling behavior. Optional dot indicators use IntersectionObserver.

**Example:**
```typescript
"use client";
import { useRef, useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";

export function PhotoCarousel({ images, alt }: { images: string[]; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div>
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <div key={img} data-index={i} className="flex-none w-full snap-center">
            <CldImage src={img} width={800} height={800} alt={`${alt} ${i + 1}`}
              crop="fill" format="auto" quality="auto" sizes="100vw" />
          </div>
        ))}
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 6: Animated Charity Counter

**What:** Count-up animation triggered by IntersectionObserver when the element scrolls into view. Uses requestAnimationFrame for smooth 60fps animation.

**Example:**
```typescript
"use client";
import { useRef, useState, useEffect } from "react";

export function CharityCounter({ total }: { total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000; // 2 seconds
          const start = performance.now();
          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out: 1 - (1 - t)^3
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * total));
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [total, hasAnimated]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-[32px] font-semibold text-primary">
        ${displayValue}
      </span>
      <span className="text-[16px] text-muted-foreground"> donated and counting!</span>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Client-side data fetching for products:** Never use `useEffect` + `fetch` for product data. Products are Server Component territory -- rendered as HTML, SEO-indexed, zero client JS.
- **Heavy carousel libraries:** Do not install Embla, Swiper, or similar. CSS scroll-snap handles this natively with better mobile performance.
- **Framer Motion for the counter:** A 30kb library for one animation is wasteful. `requestAnimationFrame` is 20 lines.
- **Instagram embed widget:** Loads third-party JS, has CORS issues, frequently breaks, and requires API auth. Use a curated Cloudinary-hosted gallery instead.
- **Separate API routes for product queries:** Server Components can query the database directly. No `/api/products` endpoint needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive images | Manual srcset/sizes logic | CldImage from next-cloudinary | Automatic format detection (WebP/AVIF), responsive transforms, CDN delivery |
| Component styling | Custom CSS from scratch | shadcn/ui components (Card, Badge, Tabs, Sheet, Skeleton) | Pre-built accessible components, consistent with design system |
| Class merging | Manual className concatenation | `cn()` utility (already in `src/lib/utils.ts`) | Handles Tailwind class conflicts correctly |
| Loading states | Custom skeleton UI | shadcn Skeleton component | Consistent with design system, accessible |
| Mobile slide-out menu | Custom drawer with animations | shadcn Sheet component | Handles focus trap, escape key, overlay, animations |

## Common Pitfalls

### Pitfall 1: CldImage Requires "use client"
**What goes wrong:** Build fails with "CldImage is not a Server Component" error.
**Why it happens:** next-cloudinary's CldImage uses hooks internally and must run in the browser.
**How to avoid:** Always add `"use client"` to any component file that imports CldImage. The parent page can still be a Server Component.
**Warning signs:** "Error: Cannot use import statement in a Server Component" at build time.

### Pitfall 2: Windows Path Breaks npx/npm Commands
**What goes wrong:** `npx shadcn@latest add card` fails with a parse error due to `&` in "Beads & Bloom".
**Why it happens:** Windows cmd.exe interprets `&` as a command separator in the path.
**How to avoid:** Run shadcn CLI directly: `node node_modules/shadcn/dist/bin.js add card badge tabs sheet separator skeleton`. For next commands: `node node_modules/next/dist/bin/next dev --turbopack`.
**Warning signs:** "The system cannot find the path specified" or unexpected command parsing errors.

### Pitfall 3: Search Params Type in Next.js 15
**What goes wrong:** `searchParams` is undefined or throws a type error in page components.
**Why it happens:** In Next.js 15, `searchParams` is a Promise that must be awaited. The type is `Promise<{ [key: string]: string | string[] | undefined }>`.
**How to avoid:** Always `await searchParams` in the page component before accessing values.
**Warning signs:** Runtime error "Cannot read properties of undefined".

### Pitfall 4: Cloudinary Public IDs vs Full URLs
**What goes wrong:** CldImage shows broken images or 404s.
**Why it happens:** Passing full Cloudinary URLs instead of public IDs to the `src` prop.
**How to avoid:** The seed data stores public IDs (e.g., `beads-and-bloom/ocean-breeze-bracelet-1`), not URLs. Use these directly in CldImage's `src` prop. Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set in `.env.local`.
**Warning signs:** 404 errors in network tab with doubled domain in the URL.

### Pitfall 5: Forgetting next.config.ts Image Domains
**What goes wrong:** Images fail to load with "hostname not configured" error.
**Why it happens:** Next.js requires explicit allowlisting of external image domains.
**How to avoid:** CldImage handles this automatically IF `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set. But if using standard `next/image` anywhere, add `images.remotePatterns` to `next.config.ts` for `res.cloudinary.com`.
**Warning signs:** Console error mentioning "hostname" and "next.config".

### Pitfall 6: Drizzle Numeric Returns Strings
**What goes wrong:** `product.price` is `"24.99"` (string) not `24.99` (number).
**Why it happens:** Drizzle's `numeric()` type returns strings to preserve decimal precision (no floating-point loss).
**How to avoid:** Format prices with `parseFloat()` or a formatting function: `$${parseFloat(price).toFixed(2)}`. For the charity counter, parse to number before animating.
**Warning signs:** "NaN" displayed or string concatenation instead of addition.

## Code Examples

### Font Change: Geist to Plus Jakarta Sans

```typescript
// src/app/layout.tsx -- UPDATED
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
  description:
    "Handmade jewelry by teen twin sisters. Every purchase donates $1 to charity. Sea turtle, starfish, and shell charm bracelets and necklaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Note:** The `--font-sans` CSS variable is already referenced in `globals.css` via the `@theme` block (`--font-sans: var(--font-sans)`). The Geist font variables (`--font-geist-sans`, `--font-geist-mono`) should be removed.

### CSS Variable Overrides for Brand Colors

```css
/* In globals.css -- replace existing :root values */
:root {
  --background: oklch(0.98 0.002 100);
  --foreground: oklch(0.145 0 0);
  --card: oklch(0.94 0.012 80);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.63 0.09 175);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.94 0.012 80);
  --secondary-foreground: oklch(0.145 0 0);
  --muted: oklch(0.95 0.008 80);
  --muted-foreground: oklch(0.48 0 0);
  --accent: oklch(0.94 0.012 80);
  --accent-foreground: oklch(0.145 0 0);
  --border: oklch(0.90 0.008 80);
  --ring: oklch(0.63 0.09 175);
  /* Keep other values (radius, destructive, popover, etc.) as-is */
}
```

### Dynamic SEO Metadata for Product Detail

```typescript
// src/app/products/[slug]/page.tsx
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = `${product.description.slice(0, 155)}. Handmade with love. $1 donated to charity with every purchase.`;

  return {
    title: `${product.name} -- Beads & Bloom`,
    description,
    openGraph: {
      title: `${product.name} -- Beads & Bloom`,
      description,
      images: product.images[0]
        ? [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_630,c_fill/${product.images[0]}`]
        : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Render product detail...
}
```

**Note:** `generateMetadata` and the page component share the same fetch, and Next.js automatically deduplicates the request (fetch memoization).

### Drizzle Query for Category Filtering

```typescript
// src/lib/queries.ts
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getProducts(category?: string) {
  const conditions = [eq(products.inStock, true)];
  if (category && category !== "all") {
    conditions.push(eq(products.category, category));
  }
  return db.select().from(products)
    .where(and(...conditions))
    .orderBy(asc(products.sortOrder));
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `searchParams` as plain object | `searchParams` is a Promise (must await) | Next.js 15 | Breaking change -- all page components that use searchParams must await |
| `params` as plain object | `params` is a Promise (must await) | Next.js 15 | Same pattern -- await params in dynamic routes |
| tailwind.config.js | CSS-first config (no config file) | Tailwind CSS 4 | Theme values via `@theme` in CSS, not JS config |
| Individual @radix-ui/* packages | Single `radix-ui` package | shadcn v4 (March 2026) | Cleaner deps, base-ui foundations |
| `next/image` for Cloudinary | CldImage from next-cloudinary | next-cloudinary v6 | Auto Cloudinary transforms, responsive sizing built in |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed yet (Wave 0 gap) |
| Config file | none -- see Wave 0 |
| Quick run command | TBD after framework selection |
| Full suite command | TBD after framework selection |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| STORE-01 | Product grid renders with correct number of products per category | smoke | Build succeeds + manual visual check | No -- Wave 0 |
| STORE-02 | Product detail page renders all fields (name, price, description, materials, care) | smoke | Build succeeds + check /products/ocean-breeze-bracelet renders | No -- Wave 0 |
| STORE-06 | Shipping page accessible at /shipping | smoke | Build succeeds + route exists | No -- Wave 0 |
| STORE-07 | Returns page accessible at /returns | smoke | Build succeeds + route exists | No -- Wave 0 |
| STORE-08 | SEO metadata present in page HTML | manual-only | View page source, check `<title>` and `<meta>` tags | N/A |
| STORE-10 | Availability badges render correctly per product | smoke | Build succeeds + visual check | No -- Wave 0 |
| BRAND-01 | About page renders with story content | smoke | Build succeeds + /about route exists | No -- Wave 0 |
| BRAND-02 | Charity counter displays value from database | smoke | Build succeeds + counter renders on homepage | No -- Wave 0 |
| BRAND-03 | Contact page renders with email and Instagram link | smoke | Build succeeds + /contact route exists | No -- Wave 0 |
| BRAND-04 | Instagram gallery renders on homepage | smoke | Build succeeds + gallery section visible | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `node node_modules/next/dist/bin/next build --turbopack` (build verification)
- **Per wave merge:** Full build + manual visual check of all routes
- **Phase gate:** Full build green + all routes render correctly

### Wave 0 Gaps
- No test framework installed. For Phase 2 (UI-heavy, read-only pages), build verification is the primary automated check. Visual regression testing could be added but is out of scope for v1.
- Recommend deferring formal test setup to Phase 3 (Cart & Checkout) where testable logic (add/remove items, price calculations) exists.

## Open Questions

1. **Cloudinary images not yet uploaded**
   - What we know: Seed data references public IDs like `beads-and-bloom/ocean-breeze-bracelet-1` but these images may not exist in Cloudinary yet.
   - What's unclear: Whether the user has uploaded product photos to Cloudinary.
   - Recommendation: Plan should include a fallback -- use placeholder images or a Cloudinary-hosted placeholder until real photos are uploaded. The CldImage component gracefully handles missing images with the `defaultImage` prop.

2. **Charity counter initial value**
   - What we know: Seed script initializes `totalDonated` to "0". No orders exist yet.
   - What's unclear: Whether the founders want a starting value for demo purposes.
   - Recommendation: Use the database value as-is. The counter animates from 0 to whatever the value is. If 0, it shows "$0 donated and counting!" which is honest and fine for a new store.

3. **Hero banner image**
   - What we know: UI-SPEC calls for a hero banner (1200x600 desktop / 800x800 mobile) but no specific image is referenced.
   - What's unclear: Whether a hero image exists or needs to be created.
   - Recommendation: Use a Cloudinary-hosted brand image if available, or a gradient/solid color background with the tagline text as a clean fallback.

## Sources

### Primary (HIGH confidence)
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- dynamic metadata pattern for product pages
- [Next.js metadata and OG images guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- metadata best practices
- [next-cloudinary CldImage basic usage](https://next.cloudinary.dev/cldimage/basic-usage) -- CldImage component API
- [next-cloudinary responsive images guide](https://next.cloudinary.dev/guides/responsive-images) -- responsive sizing with CldImage
- [next-cloudinary CldOgImage](https://next.cloudinary.dev/cldogimage/basic-usage) -- OG image generation
- [MDN CSS Carousels guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Overflow/Carousels) -- CSS scroll-snap carousel pattern
- [Chrome Developers CSS Carousels](https://developer.chrome.com/blog/carousels-with-css) -- modern CSS carousel best practices
- [Drizzle ORM + Neon tutorial](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon) -- Drizzle with Next.js and Neon
- [shadcn/ui Tabs component](https://ui.shadcn.com/docs/components/radix/tabs) -- Tabs API and usage

### Secondary (MEDIUM confidence)
- [Builder.io CSS carousel guide](https://www.builder.io/blog/css-carousel) -- practical scroll-snap patterns
- [Drizzle + Next.js CRUD guide](https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project) -- query patterns with Drizzle and Next.js 15

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, versions confirmed from package.json
- Architecture: HIGH -- follows established Next.js App Router patterns with Server Components
- Pitfalls: HIGH -- based on actual Phase 1 issues (Windows path) and documented Next.js 15 changes
- UI-SPEC alignment: HIGH -- UI-SPEC provides exact values for colors, typography, spacing, and copy

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable stack, no fast-moving dependencies)
