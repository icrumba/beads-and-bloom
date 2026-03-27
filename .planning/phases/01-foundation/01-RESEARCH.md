# Phase 1: Foundation - Research

**Researched:** 2026-03-27
**Domain:** Next.js 15 project scaffold, Drizzle ORM + Neon Postgres schema, Cloudinary image seeding
**Confidence:** HIGH

## Summary

Phase 1 establishes the development environment, database schema, and seed data that every subsequent phase builds on. The core work is: (1) scaffold a Next.js 15 app inside the agentic-os project containment boundary, (2) define the complete Drizzle ORM schema for products, orders, order_items, customers, and charity_totals with Neon Postgres, (3) run migrations, and (4) populate the database with real Beads & Bloom products including Cloudinary-hosted photos.

The stack decisions are locked from prior research: Next.js 15, Tailwind CSS 4, shadcn/ui, Drizzle ORM, Neon Postgres, Cloudinary. This phase installs only what is needed for foundation -- no Stripe, Resend, Twilio, or Zustand yet. The custom order data model must include a "Confirmed" status from day one (distinct from the standard order flow), as retrofitting this later is a significant rework identified in pitfalls research.

**Primary recommendation:** Scaffold with `create-next-app@15`, configure Drizzle ORM with the Neon HTTP serverless driver, define a schema-as-code approach with pgEnum for order statuses, and build a seed script that uploads product images to Cloudinary and inserts product records.

## Project Constraints (from CLAUDE.md)

- All project code MUST live inside `projects/briefs/beads-and-bloom-website/` -- no files at the agentic-os root
- Run build tools (npm, etc.) from the project folder, never from the agentic-os root
- `.env.local` is gitignored -- secrets never committed
- Only `NEXT_PUBLIC_` prefixed env vars are exposed to the client
- Output standards: files inside the project folder, date-prefixed naming for deliverables

## Standard Stack

### Core (Phase 1 only -- install what this phase needs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.14 | Full-stack React framework | Locked decision from STACK.md. Latest stable 15.x release. App Router with Server Components. |
| React | 19.x | UI library | Ships with Next.js 15.5.x. Required peer dependency. |
| TypeScript | 5.x | Type safety | Ships with create-next-app. Non-negotiable for schema definitions. |
| Tailwind CSS | 4.x | Styling | CSS-first config (no tailwind.config.js). Required by shadcn/ui. |
| shadcn/ui | latest CLI | Component library | Copy-in components. Init in Phase 1, add components as needed in Phase 2+. |
| Drizzle ORM | 0.45.2 | Database ORM | Locked decision. SQL-like TypeScript API, zero code generation, edge-compatible. |
| drizzle-kit | 0.31.10 | Migrations | Schema push for dev, generate+migrate for production. |
| @neondatabase/serverless | 1.0.2 | Neon HTTP driver | Serverless-compatible Postgres driver. Do NOT use node-postgres (pg). |
| next-cloudinary | 6.17.5 | Cloudinary integration | CldImage component for product photos. Needed at schema/seed level for image URLs. |
| dotenv | latest | Env vars | Load DATABASE_URL and CLOUDINARY keys for seed script. |
| zod | 4.3.6 | Schema validation | Validate seed data, form inputs later. Install now -- used everywhere. |

### Dev Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| drizzle-kit | 0.31.10 | Database migrations and schema push |
| tsx | latest | Run TypeScript seed scripts directly |
| @types/node | latest | Node.js type definitions |

### NOT installed in Phase 1

| Library | Phase | Why deferred |
|---------|-------|-------------|
| stripe, @stripe/stripe-js | Phase 3 | No payment flow yet |
| resend, react-email | Phase 3 | No notifications yet |
| zustand | Phase 3 | No cart state yet |
| @tanstack/react-table | Phase 4 | No admin tables yet |
| sonner | Phase 4 | No toast notifications yet |
| date-fns | Phase 2 | No date formatting yet |
| lucide-react | Phase 2 | Comes with shadcn/ui when components are added |

### Installation

```bash
# From inside projects/briefs/beads-and-bloom-website/
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir --no-import-alias

# shadcn/ui init (after create-next-app completes)
npx shadcn@latest init

# Database
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit tsx

# Image handling + validation
npm install next-cloudinary zod

# Seed script needs dotenv
npm install dotenv
```

**IMPORTANT:** The `create-next-app@15` command pins to Next.js 15.x (currently 15.5.14). Do NOT use `create-next-app@latest` which would install Next.js 16.x.

**IMPORTANT:** Run `create-next-app` with `.` (current directory) as the project name since the directory `beads-and-bloom-website` should already exist under `projects/briefs/`. If it does not exist, create it first with `mkdir -p`.

## Architecture Patterns

### Project Structure (Phase 1 scope)

```
projects/briefs/beads-and-bloom-website/
├── package.json
├── next.config.ts
├── tsconfig.json
├── .env.local                  # DATABASE_URL, CLOUDINARY_* (gitignored)
├── drizzle.config.ts           # Drizzle Kit configuration
├── drizzle/                    # Generated migration files
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (minimal in Phase 1)
│   │   └── page.tsx            # Homepage placeholder
│   ├── components/
│   │   └── ui/                 # shadcn/ui primitives (empty until Phase 2)
│   ├── db/
│   │   ├── schema.ts           # All table definitions + enums
│   │   ├── relations.ts        # Drizzle relation definitions
│   │   ├── index.ts            # Database client singleton
│   │   └── seed.ts             # Seed script with real product data
│   ├── lib/
│   │   └── utils.ts            # shadcn/ui utility (cn function)
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── public/
│   └── (empty, images via Cloudinary)
└── scripts/
    └── seed.ts                 # Entry point: npx tsx scripts/seed.ts
```

### Pattern 1: Schema-as-Code with Drizzle

**What:** Define all database tables, enums, and relations in TypeScript files under `src/db/`. Drizzle Kit reads these to generate/push migrations.

**When to use:** Always. This is the Drizzle way -- no separate schema files.

**Example:**

```typescript
// src/db/schema.ts
import {
  pgTable, pgEnum, text, varchar, integer, serial,
  numeric, boolean, timestamp, jsonb, uuid
} from "drizzle-orm/pg-core";

// Order status enum -- includes "confirmed" for custom orders
export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "confirmed",  // Custom orders only: founders reviewed and accepted
  "making",
  "shipped",
  "delivered",
]);

// Product availability enum
export const availabilityEnum = pgEnum("availability", [
  "ready_to_ship",
  "made_to_order",
]);

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  description: text().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  category: varchar({ length: 100 }).notNull(),
  images: jsonb().$type<string[]>().notNull().default([]),
  colors: jsonb().$type<string[]>().notNull().default([]),
  customizable: boolean().notNull().default(false),
  availability: availabilityEnum().notNull().default("ready_to_ship"),
  inStock: boolean().notNull().default(true),
  featured: boolean().notNull().default(false),
  materials: text(),
  careInfo: text(),
  sortOrder: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  address: jsonb().$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>(),
  orderCount: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  stripeSessionId: varchar({ length: 255 }).unique(),
  customerId: integer().references(() => customers.id),
  status: orderStatusEnum().notNull().default("new"),
  totalAmount: numeric({ precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb().$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>().notNull(),
  giftMessage: text(),
  notes: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial().primaryKey(),
  orderId: integer().notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer().notNull().references(() => products.id),
  quantity: integer().notNull().default(1),
  unitPrice: numeric({ precision: 10, scale: 2 }).notNull(),
  customColors: jsonb().$type<string[]>(),
});

export const charityTotals = pgTable("charity_totals", {
  id: serial().primaryKey(),
  totalDonated: numeric({ precision: 10, scale: 2 }).notNull().default("0"),
  orderCount: integer().notNull().default(0),
  lastUpdated: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
```

### Pattern 2: Database Client Singleton

**What:** Create a single Drizzle client instance that gets reused across all server-side code.

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
```

**Source:** [Drizzle + Neon official docs](https://orm.drizzle.team/docs/get-started/neon-new)

### Pattern 3: Drizzle Config

```typescript
// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Pattern 4: Seed Script Structure

**What:** A TypeScript script run via `npx tsx scripts/seed.ts` that inserts real product data and initializes the charity counter. Images are referenced by Cloudinary public IDs (uploaded manually or via Cloudinary API ahead of time).

```typescript
// scripts/seed.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { products, charityTotals } from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const PRODUCTS = [
  {
    name: "Ocean Breeze Bracelet",
    slug: "ocean-breeze-bracelet",
    description: "Heishi clay bead bracelet in calming ocean blues...",
    price: "24.99",
    category: "bracelets",
    images: ["beads-and-bloom/ocean-breeze-1", "beads-and-bloom/ocean-breeze-2"],
    colors: ["Ocean Blue", "Sea Foam", "Pearl White"],
    customizable: true,
    availability: "made_to_order" as const,
    featured: true,
    materials: "Heishi clay beads, stretch cord",
    careInfo: "Avoid water. Store flat.",
    sortOrder: 1,
  },
  // ... more products
];

async function seed() {
  console.log("Seeding products...");
  await db.insert(products).values(PRODUCTS);

  console.log("Initializing charity counter...");
  await db.insert(charityTotals).values({
    totalDonated: "0",
    orderCount: 0,
  });

  console.log("Seed complete!");
}

seed().catch(console.error);
```

### Anti-Patterns to Avoid

- **Using `pg` (node-postgres) instead of `@neondatabase/serverless`:** The `pg` driver does not work on edge/serverless runtimes. Always use the Neon HTTP driver for Vercel deployment.
- **Running `create-next-app` at the agentic-os root:** All project files must be inside `projects/briefs/beads-and-bloom-website/`. Run the scaffold command from within that directory.
- **Skipping the "confirmed" order status:** The pitfalls research explicitly warns that retrofitting a custom order workflow onto a flat order model is a significant rework. Include it in the enum from day one.
- **Storing product images in `public/`:** Use Cloudinary public IDs in the database. Never commit product photos to the repo.
- **Using `drizzle-kit push` in production:** Use `push` for dev iteration only. Generate migration files with `drizzle-kit generate` and apply with `drizzle-kit migrate` for production.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database migrations | Manual SQL files | `drizzle-kit push` (dev) / `drizzle-kit generate + migrate` (prod) | Drizzle Kit tracks schema diffs automatically |
| CSS utility system | Custom CSS classes | Tailwind CSS 4 | CSS-first config, no tailwind.config.js needed |
| Component primitives | Custom buttons, cards, forms | shadcn/ui | Accessible, customizable, copies into project |
| Image optimization | Manual resize/compress pipeline | next-cloudinary CldImage + Cloudinary transforms | Automatic WebP/AVIF, responsive srcset via URL params |
| Schema validation | Manual type checking | Zod schemas | Type-safe validation, integrates with Server Actions |
| Environment variables | Manual process.env handling | Next.js built-in .env.local + dotenv for scripts | Automatic loading in Next.js, dotenv for standalone scripts |

## Common Pitfalls

### Pitfall 1: create-next-app Version Mismatch

**What goes wrong:** Running `npx create-next-app@latest` installs Next.js 16.x instead of the locked decision of 15.x.
**Why it happens:** Next.js 16 is now the latest stable release (16.2.1 as of today).
**How to avoid:** Always use `npx create-next-app@15` to pin to the 15.x line. Current latest 15.x is 15.5.14.
**Warning signs:** `package.json` shows `"next": "^16"` or React 20.x.

### Pitfall 2: Wrong Neon Driver

**What goes wrong:** Installing `pg` (node-postgres) instead of `@neondatabase/serverless` causes runtime failures on Vercel.
**Why it happens:** Many Postgres tutorials default to `pg`. Drizzle docs show both options.
**How to avoid:** Use `drizzle-orm/neon-http` driver with `@neondatabase/serverless`. This is the HTTP-based driver that works on edge and serverless.
**Warning signs:** "Connection refused" or TCP socket errors in Vercel logs.

### Pitfall 3: Missing Tailwind CSS v4 Configuration

**What goes wrong:** shadcn/ui components render unstyled because Tailwind v4's CSS-first config was not set up correctly.
**Why it happens:** Tailwind v4 uses `@import "tailwindcss"` and `@theme` directives in CSS instead of a `tailwind.config.js`. Old tutorials show the v3 approach.
**How to avoid:** Let `create-next-app@15` with `--tailwind` flag handle the Tailwind setup. Then run `npx shadcn@latest init` which detects Tailwind v4 and configures accordingly. Do not manually create a `tailwind.config.js` file.
**Warning signs:** A `tailwind.config.js` file exists alongside CSS `@theme` directives (conflicting configs).

### Pitfall 4: Numeric Precision for Money

**What goes wrong:** Using `real()` or `integer()` for prices causes rounding errors or requires constant cents-to-dollars conversion.
**Why it happens:** Floating point is the default instinct. Storing cents as integers is common but adds conversion overhead.
**How to avoid:** Use `numeric({ precision: 10, scale: 2 })` for all money fields. Postgres `numeric` is exact. Drizzle returns it as a string -- convert at the display layer.
**Warning signs:** Prices showing as `24.989999999` or `2499` (cents without conversion).

### Pitfall 5: Project Containment Violation

**What goes wrong:** Running `npm init` or `create-next-app` from the agentic-os root creates `node_modules`, `package.json`, etc. at the root level.
**Why it happens:** Forgetting to `cd` into the project directory first.
**How to avoid:** Always verify `pwd` before running any scaffold or install command. The working directory must be `projects/briefs/beads-and-bloom-website/`.
**Warning signs:** `node_modules/` or `package.json` appearing at the agentic-os root.

### Pitfall 6: Drizzle Schema Relations in Same File

**What goes wrong:** Circular dependency issues when defining relations alongside table definitions.
**Why it happens:** Drizzle relations reference tables that may not be defined yet in the same file.
**How to avoid:** Define all `pgTable` exports in `schema.ts`, then define all `relations()` in a separate `relations.ts` file that imports from `schema.ts`.
**Warning signs:** TypeScript errors about undefined variables or circular imports.

## Code Examples

### Drizzle Relations Definition

```typescript
// src/db/relations.ts
import { relations } from "drizzle-orm";
import { orders, orderItems, customers, products } from "./schema";

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));
```

### Cloudinary Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# For seed script only (not needed at runtime)
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx scripts/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | CSS-first `@theme` directives | Tailwind v4 (Jan 2026) | No config file needed. Faster builds. |
| `prisma generate` workflow | Drizzle schema-as-code (no generation) | Drizzle 0.30+ | No build step, instant hot reload |
| Individual `@radix-ui/react-*` packages | Single `radix-ui` package | shadcn/ui CLI v4 (March 2026) | Cleaner dependencies |
| `create-next-app@latest` for Next.js 15 | Must pin `create-next-app@15` | Next.js 16.0 release | Latest now installs 16.x |
| `pg` (node-postgres) for Postgres | `@neondatabase/serverless` for Neon | Neon 1.0 | HTTP-based, works on edge/serverless |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Everything | Yes | v25.4.0 | -- |
| npm | Package management | Yes | 11.8.0 | -- |
| npx | Scaffold commands | Yes | 11.8.0 | -- |
| git | Version control | Yes | 2.52.0 | -- |
| Neon Postgres | Database | External service | Managed | Requires account setup + DATABASE_URL |
| Cloudinary | Product images | External service | Managed | Requires account setup + cloud name |

**Missing dependencies with no fallback:**
- Neon Postgres account: Must be created and DATABASE_URL configured in `.env.local` before migrations can run
- Cloudinary account: Must be created and cloud name configured before seed script references images

**Missing dependencies with fallback:**
- None -- all local tools are available

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None yet -- Phase 1 creates the project from scratch |
| Config file | None -- see Wave 0 |
| Quick run command | `npm run lint` (ESLint from create-next-app) |
| Full suite command | `npm run build` (type checking + build validation) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SC-01 | Next.js 15 runs locally with Tailwind + shadcn | smoke | `npm run dev` (manual verify) + `npm run build` | No -- Wave 0 |
| SC-02 | Drizzle connects to Neon, all tables exist | integration | `npx tsx scripts/verify-schema.ts` | No -- Wave 0 |
| SC-03 | Seed script populates products with Cloudinary images | integration | `npm run db:seed` (idempotent, verifiable) | No -- Wave 0 |
| SC-04 | Order status enum includes "confirmed" step | unit | Schema type check (TypeScript compilation) | No -- Wave 0 |
| SC-05 | All files inside project folder, none at root | smoke | `ls` check for package.json at agentic-os root | No -- Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` (catches type errors and import issues)
- **Per wave merge:** `npm run build` + `npm run db:push` (schema validates against Neon)
- **Phase gate:** Full build green + seed script runs successfully + dev server starts

### Wave 0 Gaps

- [ ] `scripts/verify-schema.ts` -- smoke test that connects to DB and lists all tables
- [ ] ESLint config comes from create-next-app (no additional setup needed)
- [ ] No test runner (jest/vitest) needed in Phase 1 -- TypeScript compilation + build is sufficient validation

## Open Questions

1. **Neon database provisioning**
   - What we know: Neon free tier gives 0.5GB storage, 100 CU-hours/month. Account creation is manual.
   - What's unclear: Whether the user already has a Neon account or needs to create one.
   - Recommendation: Plan includes a step to verify DATABASE_URL is set before running migrations. Provide Neon signup link.

2. **Cloudinary image upload strategy for seed data**
   - What we know: next-cloudinary uses cloud name + public IDs. Images can be uploaded via Cloudinary dashboard or API.
   - What's unclear: Whether founders have product photos ready, or if we need placeholder images.
   - Recommendation: Seed script should work with Cloudinary public IDs. If photos are not ready, use placeholder public IDs that can be swapped later. Include a manual upload step in the plan.

3. **Exact product catalog for seeding**
   - What we know: Product types from PROJECT.md -- heishi clay bead bracelets, pearl + charm pieces, gold chain necklaces with ocean-themed charms.
   - What's unclear: Exact product names, prices, descriptions, and color options.
   - Recommendation: Create seed data with realistic products based on the known catalog. Founders can adjust via admin in Phase 4.

## Sources

### Primary (HIGH confidence)
- [Drizzle ORM + Neon setup](https://orm.drizzle.team/docs/get-started/neon-new) -- exact install commands and config
- [Drizzle PostgreSQL column types](https://orm.drizzle.team/docs/column-types/pg) -- pgEnum, numeric, jsonb, timestamp usage
- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next) -- init and component add commands
- [shadcn/ui Tailwind v4 guide](https://ui.shadcn.com/docs/tailwind-v4) -- CSS-first config, @theme directives
- [Neon connection guide for Drizzle](https://neon.com/docs/guides/drizzle) -- serverless driver setup
- npm registry -- verified all package versions (2026-03-27)

### Secondary (MEDIUM confidence)
- [next-cloudinary GitHub](https://github.com/cloudinary-community/next-cloudinary) -- CldImage component and upload patterns
- [Cloudinary programmatic upload docs](https://cloudinary.com/documentation/upload_images) -- seed script image upload

### Tertiary (LOW confidence)
- None -- all findings verified against official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry today, all libraries from locked STACK.md decisions
- Architecture: HIGH -- project structure follows official Next.js + Drizzle patterns from their docs
- Pitfalls: HIGH -- derived from project-specific PITFALLS.md research + verified against current package versions

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable ecosystem, no breaking changes expected)
