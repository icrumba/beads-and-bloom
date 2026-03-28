# Phase 4: Admin & Order Management - Research

**Researched:** 2026-03-28
**Domain:** Next.js admin dashboard, CRUD operations, middleware auth, data tables, email notifications
**Confidence:** HIGH

## Summary

Phase 4 builds a password-protected admin dashboard at `/admin/*` for the two teen founders to manage orders, products, and customers from their phones, plus a public order tracking page at `/track`. The existing codebase has a solid foundation: Drizzle schema with orders/products/customers tables, established Server Action patterns (Zod validation, `"use server"` directive), React Email templates, Resend integration, and seven shadcn/ui components already installed.

The primary technical challenges are: (1) Next.js middleware for cookie-based admin auth, (2) `@tanstack/react-table` with shadcn's data-table pattern for the order list, (3) Cloudinary upload widget for product image management, and (4) extending the existing webhook to send admin notification emails. All decisions are locked in CONTEXT.md -- no architectural choices remain open.

**Primary recommendation:** Build admin as Server Component pages with targeted Client Component islands (data table, product form, upload widget). Use Next.js middleware for auth, Server Actions for all mutations, and extend the existing query/email patterns rather than creating new ones.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Simple middleware-based password protection. Single shared password stored in env var (ADMIN_PASSWORD). Middleware checks for a session cookie -- if missing or invalid, redirects to /admin/login.
- **D-02:** Login page is a simple password field + submit button. On correct password, sets httpOnly session cookie. No user accounts, no NextAuth.
- **D-03:** Session cookie expires after 7 days. No "remember me" option needed -- just re-enter the password.
- **D-04:** Order list at /admin/orders using @tanstack/react-table with shadcn data-table pattern. Columns: order number, customer name, date, total, status badge, actions.
- **D-05:** Status badges use colors: New (blue), Making (amber), Shipped (purple), Delivered (green).
- **D-06:** One-tap status advance: each order row has a "Next Status" button that moves to the next stage (New -> Making -> Shipped -> Delivered). No dropdown -- just one tap forward.
- **D-07:** Order detail page at /admin/orders/[id] shows full order info: items with colors, customer contact, shipping address, gift message, payment details.
- **D-08:** Filter orders by status tab (All, New, Making, Shipped, Delivered). Search by customer name or order number.
- **D-09:** Toast notification (sonner) on status update confirmation.
- **D-10:** Product list at /admin/products with add/edit/remove capabilities.
- **D-11:** Product form at /admin/products/new and /admin/products/[id]/edit with fields matching the schema: name, slug (auto-generated from name), description, price, category (dropdown), availability (dropdown), images, colors, materials, care info, featured toggle, in-stock toggle.
- **D-12:** Image upload uses Cloudinary upload widget (CldUploadWidget from next-cloudinary). Drag and drop or click to upload. Returns public ID stored in product.images array.
- **D-13:** Delete product requires confirmation dialog ("Are you sure? This cannot be undone.").
- **D-14:** When webhook processes a new order, send a notification email to the founders' email address (stored in ADMIN_EMAIL env var).
- **D-15:** Admin notification email: subject "New Order #{orderNumber}", body includes customer name, items ordered, total, shipping address. Simple, scannable format -- founders check this on their phones.
- **D-16:** Triggered in the same webhook handler as the customer confirmation email (Phase 3). Two emails sent: one to customer, one to admin.
- **D-17:** Public page at /track (no login required). Customer enters order number + email.
- **D-18:** If found, shows: order status with visual progress bar (New -> Making -> Shipped -> Delivered), ordered items, estimated delivery based on status, and order date.
- **D-19:** If not found, shows friendly message: "We couldn't find that order. Double-check your order number and email."

### Claude's Discretion
- Admin dashboard layout (sidebar vs top nav)
- Table pagination (client-side is fine for low volume)
- Product form validation details
- Loading and error states in admin

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMIN-01 | Founders can view all orders with filtering and search | D-04, D-08: @tanstack/react-table with shadcn data-table, status tabs, search by name/order number |
| ADMIN-02 | Founders can update order fulfillment status | D-06: One-tap "Next Status" button via Server Action, D-09: sonner toast confirmation |
| ADMIN-03 | Founders can add, edit, and remove products with photos | D-10, D-11, D-12, D-13: Product CRUD with CldUploadWidget, Zod-validated forms, confirmation dialog |
| ADMIN-04 | Founders receive email notification when new order placed | D-14, D-15, D-16: Extend webhook handler with admin notification email via Resend |
| ADMIN-05 | Dashboard displays customer info | D-07: Order detail page with customer contact, shipping, order history, custom requests |
| ADMIN-06 | Admin interface is mobile-friendly and simple enough for teen founders | D-01-D-03: Simple password auth, all decisions emphasize mobile-first, simple UX |
| CUST-01 | User can check order status using order number or email | D-17, D-19: Public /track page with order number + email lookup |
| CUST-02 | Order tracking shows current fulfillment status | D-18: Visual progress bar showing New -> Making -> Shipped -> Delivered |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | 15.5.14 | Framework, middleware, Server Actions | Installed |
| shadcn/ui | 4.1.1 | UI components (Badge, Card, Tabs, Button, Sheet, Separator, Skeleton) | 7 components installed |
| next-cloudinary | 6.17.5 | CldUploadWidget for product image uploads | Installed |
| sonner | 2.0.0 | Toast notifications for status updates | Installed |
| Resend | 6.9.4 | Email sending (admin notifications) | Installed |
| @react-email/components | 1.0.10 | Email template building | Installed |
| Drizzle ORM | 0.45.2 | Database queries and mutations | Installed |
| zod | 4.3.6 | Form validation schemas | Installed |
| zustand | 5.0.0 | Client state (not needed for admin -- Server Components) | Installed |

### To Install
| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| @tanstack/react-table | ^8.x | Data table for order/product lists | D-04 requires it. shadcn data-table pattern depends on it. |

### shadcn Components to Add
| Component | Purpose | Install Command |
|-----------|---------|-----------------|
| Table | Data table rendering | `npx shadcn@latest add table` |
| Input | Form fields (product form, search, login) | `npx shadcn@latest add input` |
| Label | Form field labels | `npx shadcn@latest add label` |
| Select | Category/availability dropdowns | `npx shadcn@latest add select` |
| Switch | Featured/in-stock toggles | `npx shadcn@latest add switch` |
| Textarea | Product description, care info | `npx shadcn@latest add textarea` |
| Dialog | Product delete confirmation (D-13) | `npx shadcn@latest add dialog` |
| DropdownMenu | Potential order actions menu | `npx shadcn@latest add dropdown-menu` |
| Toaster | sonner toast container (may already be in layout) | `npx shadcn@latest add sonner` |

**Installation (inside project directory):**
```bash
cd projects/briefs/beads-and-bloom-website
npm install --ignore-scripts @tanstack/react-table
npx shadcn@latest add table input label select switch textarea dialog dropdown-menu sonner
```

Note: `--ignore-scripts` is required due to Windows path with `&` character (Phase 1 decision).

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell (nav, mobile-friendly layout)
│   │   ├── page.tsx                # Dashboard redirect -> /admin/orders
│   │   ├── login/
│   │   │   └── page.tsx            # Password login form
│   │   ├── orders/
│   │   │   ├── page.tsx            # Order list with data table (ADMIN-01)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Order detail page (D-07)
│   │   ├── products/
│   │   │   ├── page.tsx            # Product list (D-10)
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # New product form (D-11)
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit product form (D-11)
│   │   └── customers/
│   │       └── page.tsx            # Customer list (ADMIN-05)
│   └── track/
│       └── page.tsx                # Public order tracking (CUST-01, CUST-02)
├── actions/
│   ├── stripe.ts                   # Existing checkout action
│   ├── admin-auth.ts               # Login/logout Server Actions
│   ├── orders.ts                   # Order status update Server Action
│   └── products.ts                 # Product CRUD Server Actions
├── components/
│   ├── admin/
│   │   ├── order-table.tsx         # Client Component: data table with filters
│   │   ├── order-status-badge.tsx  # Status badge with colors (D-05)
│   │   ├── order-status-button.tsx # One-tap advance button (D-06)
│   │   ├── product-form.tsx        # Client Component: product add/edit form
│   │   ├── product-delete-dialog.tsx # Delete confirmation (D-13)
│   │   ├── admin-nav.tsx           # Mobile-friendly navigation
│   │   └── admin-shell.tsx         # Layout wrapper
│   └── track/
│       └── order-progress.tsx      # Visual progress bar (D-18)
├── emails/
│   ├── order-confirmation.tsx      # Existing customer email
│   └── admin-notification.tsx      # New admin email (D-14, D-15)
├── lib/
│   └── queries.ts                  # Extend with admin queries
└── middleware.ts                    # NEW: Admin auth middleware
```

### Pattern 1: Next.js Middleware for Admin Auth (D-01, D-02, D-03)

**What:** Middleware intercepts all `/admin/*` requests (except `/admin/login`) and checks for a valid session cookie. No NextAuth, no user accounts.

**How it works:**
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("admin_session");

    if (!session || session.value !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Login Server Action pattern:**
```typescript
// src/actions/admin-auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Wrong password" };
  }

  // Set httpOnly cookie, expires in 7 days (D-03)
  (await cookies()).set("admin_session", process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/admin/orders");
}
```

**Key detail:** The cookie value should be a secret (ADMIN_SESSION_SECRET env var), not the password itself. Middleware compares cookie value to the env var.

### Pattern 2: Server Actions for Mutations

**What:** All admin mutations (status update, product CRUD) use Server Actions with Zod validation. This follows the existing pattern in `src/actions/stripe.ts`.

**Status update example:**
```typescript
// src/actions/orders.ts
"use server";

import { z } from "zod/v4";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const statusFlow = ["new", "making", "shipped", "delivered"] as const;

export async function advanceOrderStatus(orderId: number) {
  const [order] = await db
    .select({ status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!order) throw new Error("Order not found");

  const currentIdx = statusFlow.indexOf(order.status as typeof statusFlow[number]);
  if (currentIdx === -1 || currentIdx >= statusFlow.length - 1) {
    return { error: "Order cannot be advanced" };
  }

  const nextStatus = statusFlow[currentIdx + 1];

  await db
    .update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
  return { success: true, newStatus: nextStatus };
}
```

### Pattern 3: @tanstack/react-table with shadcn (D-04)

**What:** shadcn provides a data-table pattern that wraps @tanstack/react-table with their Table component. It's a Client Component that receives data from a Server Component parent.

**Architecture:**
- Server Component page fetches orders from DB
- Passes data as props to Client Component `<OrderTable data={orders} />`
- OrderTable defines columns, handles filtering/sorting client-side
- For low volume (5-10 orders/day), client-side pagination is fine

**Column definitions follow this pattern:**
```typescript
const columns: ColumnDef<OrderWithCustomer>[] = [
  { accessorKey: "id", header: "Order #" },
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d"),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => `$${row.getValue("totalAmount")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderStatusButton order={row.original} />,
  },
];
```

### Pattern 4: CldUploadWidget for Product Images (D-12)

**What:** next-cloudinary provides `CldUploadWidget` that opens the Cloudinary upload widget. It returns the public ID which gets stored in the product's `images` jsonb array.

```typescript
"use client";

import { CldUploadWidget } from "next-cloudinary";

function ImageUploader({ images, onUpload }: { images: string[]; onUpload: (id: string) => void }) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result) => {
        if (typeof result.info === "object" && result.info.public_id) {
          onUpload(result.info.public_id);
        }
      }}
    >
      {({ open }) => (
        <button type="button" onClick={() => open()}>
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
}
```

**Env vars needed:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (likely already set from Phase 2), `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (unsigned upload preset -- must be created in Cloudinary dashboard).

### Pattern 5: Extending Webhook for Admin Email (D-14, D-16)

**What:** Add a second `resend.emails.send()` call in the existing webhook's try/catch block for the admin notification.

```typescript
// Inside webhook route.ts, after customer email send:
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || "Beads & Bloom <orders@beadsandbloom.com>",
  to: process.env.ADMIN_EMAIL!,
  subject: `New Order #${order.id}`,
  react: AdminNotificationEmail({
    orderNumber: order.id,
    customerName,
    customerEmail,
    items: emailItems,
    total: totalAmount,
    shippingAddress,
  }),
});
```

Both emails wrapped in the same try/catch -- email failures never fail the webhook (existing pattern).

### Anti-Patterns to Avoid
- **Don't use API routes for admin mutations** -- Server Actions are the established pattern. The only API route is the Stripe webhook (which must be an API route for external POST).
- **Don't build a separate admin app** -- Admin pages live at `/admin/*` in the same Next.js app. D-07 in CONTEXT.md explicitly states this.
- **Don't use `useEffect` for data fetching** -- Server Components fetch data. Only use Client Components for interactive elements (table, forms, upload widget).
- **Don't store the password in the cookie** -- Cookie holds a separate session secret; middleware compares against env var.
- **Don't use `"confirmed"` status in the UI flow** -- The schema has a "confirmed" status for custom orders, but the main flow is New -> Making -> Shipped -> Delivered. The "confirmed" status should be skipped in the one-tap advance for standard orders.

### Admin Layout Recommendation (Claude's Discretion)

**Use top navigation, not sidebar.** Rationale:
- Mobile-first for teen founders using phones
- Only 3-4 nav items (Orders, Products, Customers, Logout)
- Sidebar wastes horizontal space on mobile
- Top nav with icon + label is more app-like (matches how teens use apps)

```
[Orders] [Products] [Customers] [Logout]
```

On mobile, this becomes a compact horizontal strip or bottom tab bar.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data tables | Custom table with sorting/filtering | @tanstack/react-table + shadcn Table | Column definitions, sorting, filtering, pagination all built in. Writing custom table logic is error-prone. |
| Image uploads | Custom file input + fetch to Cloudinary API | CldUploadWidget from next-cloudinary | Handles drag-drop, progress, error states, mobile camera access, returns public ID. Cloudinary's widget is battle-tested. |
| Toast notifications | Custom notification system | sonner (already installed) | One-liner: `toast.success("Status updated")`. Already installed and used by shadcn. |
| Form validation | Manual if/else checks | Zod schemas + Server Action validation | Existing pattern from checkout. Type-safe, composable, clear error messages. |
| Email templates | Raw HTML strings | React Email components | Existing pattern from order-confirmation.tsx. Type-safe, reusable, renders consistently across email clients. |
| Session cookies | Manual cookie parsing | Next.js `cookies()` API | Built into Next.js Server Actions and middleware. Handles httpOnly, secure, sameSite automatically. |

## Common Pitfalls

### Pitfall 1: Middleware Not Matching Admin Routes
**What goes wrong:** Admin pages load without auth because middleware matcher is misconfigured.
**Why it happens:** Next.js middleware `config.matcher` uses a specific glob syntax. Missing the wildcard pattern means subroutes don't get checked.
**How to avoid:** Use `matcher: ["/admin/:path*"]` which catches all `/admin/*` routes. Explicitly exclude `/admin/login` inside the middleware function, not in the matcher.
**Warning signs:** Admin pages accessible in incognito without entering password.

### Pitfall 2: Server Action Cookie Setting Requires Await
**What goes wrong:** `cookies().set()` fails silently or throws an error.
**Why it happens:** In Next.js 15, `cookies()` returns a Promise and must be awaited: `(await cookies()).set(...)`. This is different from Next.js 14 where it was synchronous.
**How to avoid:** Always `await cookies()` before calling `.set()`, `.get()`, or `.delete()`.
**Warning signs:** Login appears to work but cookie is never set; user gets redirected back to login.

### Pitfall 3: Zod v4 Import Path
**What goes wrong:** Import fails or wrong Zod version loaded.
**Why it happens:** The project uses `zod@4.3.6` which requires importing from `"zod/v4"` (see existing `stripe.ts` action). This is different from zod v3's standard `"zod"` import.
**How to avoid:** Always import as `import { z } from "zod/v4"` -- match the existing pattern.
**Warning signs:** TypeScript errors about incompatible schema types, `z.email()` not found.

### Pitfall 4: revalidatePath After Mutations
**What goes wrong:** Admin pages show stale data after status update or product edit.
**Why it happens:** Next.js caches Server Component renders. After a Server Action mutation, the page must be revalidated.
**How to avoid:** Call `revalidatePath("/admin/orders")` or the relevant path after every mutation.
**Warning signs:** Page shows old data; refreshing fixes it.

### Pitfall 5: CldUploadWidget Needs Unsigned Upload Preset
**What goes wrong:** Cloudinary widget fails with "Upload preset not found" or auth error.
**Why it happens:** CldUploadWidget uses client-side unsigned uploads. It needs an upload preset configured as "unsigned" in the Cloudinary dashboard.
**How to avoid:** Document in the plan that NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET must be set and the preset must exist in Cloudinary as "unsigned."
**Warning signs:** Widget opens but upload fails with 400/401 error.

### Pitfall 6: Numeric Price as String in Drizzle
**What goes wrong:** Price comparisons or formatting break.
**Why it happens:** Drizzle's `numeric(10,2)` returns strings, not numbers (Phase 1 decision). All price values in the DB are strings like `"6.00"`.
**How to avoid:** Always use `parseFloat()` when doing math with prices. Display with `$${value}` since it's already formatted as `"6.00"`.
**Warning signs:** NaN in price displays, prices sorted as strings ("10.00" before "6.00").

### Pitfall 7: Order Has "confirmed" Status Not in UI Flow
**What goes wrong:** The one-tap advance hits "confirmed" instead of going New -> Making.
**Why it happens:** The schema enum includes `"confirmed"` for custom orders, but the standard flow is `["new", "making", "shipped", "delivered"]`.
**How to avoid:** The status advance function should use the 4-step flow array, not the full enum. If an order is at "confirmed" status, treat it the same as "new" for advancement purposes.
**Warning signs:** Orders get stuck at "confirmed" with no way to advance.

### Pitfall 8: Windows npm Binary Execution
**What goes wrong:** `npx shadcn@latest add` or other npm binaries fail on this project.
**Why it happens:** The project path contains `&` character ("Beads & Bloom") which breaks Windows shell parsing.
**How to avoid:** Use `node node_modules/.bin/...` pattern or quote the path. For shadcn CLI specifically, `npx` should work since it runs in a temp directory, but test first. Use `--ignore-scripts` for npm install.
**Warning signs:** "The system cannot find the path specified" errors.

## Code Examples

### Admin Query Functions (extend queries.ts)

```typescript
// Orders with customer info for admin list
export async function getAdminOrders(status?: string) {
  const baseQuery = db
    .select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      giftMessage: orders.giftMessage,
      createdAt: orders.createdAt,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.createdAt));

  if (status && status !== "all") {
    return baseQuery.where(eq(orders.status, status));
  }
  return baseQuery;
}

// Full order detail with items and product info
export async function getOrderDetail(orderId: number) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      customColors: orderItems.customColors,
      productName: products.name,
      productImage: products.images,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  const customer = order.customerId
    ? (await db.select().from(customers).where(eq(customers.id, order.customerId)))[0]
    : null;

  return { ...order, items, customer };
}

// Product CRUD
export async function getAllProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

export async function getProductById(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}

// Order tracking (public)
export async function getOrderByIdAndEmail(orderId: number, email: string) {
  const result = await db
    .select({
      id: orders.id,
      status: orders.status,
      createdAt: orders.createdAt,
      totalAmount: orders.totalAmount,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(and(eq(orders.id, orderId), eq(customers.email, email)))
    .limit(1);
  return result[0] ?? null;
}
```

### Admin Notification Email Template

```typescript
// src/emails/admin-notification.tsx
// Follow the exact same pattern as order-confirmation.tsx:
// - React Email components
// - Inline styles (CSSProperties)
// - Brand colors from UI spec (#3B9B8F accent, #1c1917 text, #fafaf9 bg)
// - Simple, scannable layout for phone reading

export function AdminNotificationEmail({
  orderNumber,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress,
}: AdminNotificationProps) {
  // Structure: "New Order #123" heading, customer name + email,
  // item list (name x qty), total, shipping address
  // Keep it SHORT -- founders scan this on their phone notification
}
```

### Status Badge Component

```typescript
// src/components/admin/order-status-badge.tsx
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  making: { label: "Making", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.new;
  return <Badge className={config.className}>{config.label}</Badge>;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| API routes for mutations | Server Actions with `"use server"` | Next.js 14+ (stable in 15) | Simpler code, automatic loading states, no fetch boilerplate |
| `cookies()` sync | `await cookies()` async | Next.js 15 | Must await before set/get/delete |
| zod v3 `import { z } from "zod"` | zod v4 `import { z } from "zod/v4"` | zod 4.x | Different import path, new validators like `z.email()` |
| Individual `@radix-ui/react-*` packages | Unified `radix-ui` package | shadcn CLI v4 (March 2026) | Single dependency for all Radix primitives |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Cloudinary account | Product image uploads (D-12) | Needs env vars | N/A | Cannot upload images without Cloudinary; product management still works for text fields |
| ADMIN_PASSWORD env var | Auth (D-01) | Must be set | N/A | Admin pages inaccessible without it |
| ADMIN_SESSION_SECRET env var | Session cookie (D-01) | Must be set | N/A | Generate a random string |
| ADMIN_EMAIL env var | Admin notifications (D-14) | Must be set | N/A | Skip admin email if not set |
| NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET | Image upload widget | Must be configured in Cloudinary dashboard | N/A | Upload fails without it |

**New env vars to document:**
- `ADMIN_PASSWORD` -- shared admin password
- `ADMIN_SESSION_SECRET` -- random string for cookie validation
- `ADMIN_EMAIL` -- founders' email for order notifications
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` -- unsigned upload preset name (if not already set)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test framework installed yet |
| Config file | None -- Wave 0 must set up |
| Quick run command | TBD after framework choice |
| Full suite command | TBD after framework choice |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADMIN-01 | Order list renders with filtering | smoke | Build succeeds + manual verification | No |
| ADMIN-02 | Status advance mutation works | unit | Test Server Action with mock DB | No |
| ADMIN-03 | Product CRUD operations | unit | Test Server Actions for create/update/delete | No |
| ADMIN-04 | Admin notification email sent | unit | Test email template renders | No |
| ADMIN-05 | Customer info displays | smoke | Build succeeds + manual verification | No |
| ADMIN-06 | Mobile-friendly admin | manual-only | Visual inspection on mobile viewport | N/A |
| CUST-01 | Order lookup by number + email | unit | Test query function | No |
| CUST-02 | Progress bar renders correctly | smoke | Build succeeds + manual verification | No |

### Sampling Rate
- **Per task commit:** `node node_modules/.bin/next build` (type checking + build verification)
- **Per wave merge:** Full build + manual admin page walkthrough
- **Phase gate:** All admin pages load, CRUD operations work, order tracking works

### Wave 0 Gaps
- [ ] No test framework installed -- consider adding vitest for unit testing Server Actions
- [ ] No test files exist -- ADMIN-02 and CUST-01 are good candidates for unit tests
- [ ] For this phase, build verification (`next build`) is the primary automated check since most requirements are UI/interaction focused

## Open Questions

1. **"confirmed" status handling**
   - What we know: Schema has 5 statuses including "confirmed" (for custom orders). The UI flow is 4 steps: New -> Making -> Shipped -> Delivered.
   - What's unclear: Should "confirmed" appear in the admin UI at all? Can founders manually set a custom order to "confirmed"?
   - Recommendation: Ignore "confirmed" in the standard flow. If an order is at "confirmed", treat it as equivalent to "new" for the Next Status button. This can be revisited in a future phase for custom order workflows.

2. **Order number display format**
   - What we know: Orders use auto-increment `serial()` IDs starting at 1.
   - What's unclear: Should the display format be `#1`, `#001`, or `BB-001`?
   - Recommendation: Display as `#${id}` for simplicity. Low volume means IDs won't get confusingly large. Avoid zero-padding or prefixes that add complexity.

3. **Cloudinary upload preset**
   - What we know: CldUploadWidget requires an upload preset. The Cloudinary account may or may not have one configured.
   - What's unclear: Whether the user has created an unsigned upload preset.
   - Recommendation: Plan should include a task or note about creating the upload preset in Cloudinary dashboard if it doesn't exist.

## Project Constraints (from CLAUDE.md)

- All code must live inside `projects/briefs/beads-and-bloom-website/`
- Use `node node_modules/.bin/...` for running binaries (Windows path workaround)
- Use `--ignore-scripts` for npm install
- Prices stored as string values for Drizzle numeric(10,2) columns
- Import zod from `"zod/v4"` (not `"zod"`)
- Server Components for data fetching, Client Components only for interactivity
- Server Actions for mutations (not API routes)
- Every page must score 90+ on Lighthouse Mobile
- Admin is password-protected pages at `/admin/*`, not a separate app
- Lazy DB proxy pattern to prevent build failures without DATABASE_URL

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/db/schema.ts`, `src/lib/queries.ts`, `src/actions/stripe.ts`, `src/app/api/webhook/route.ts`, `src/emails/order-confirmation.tsx` -- all patterns verified from actual code
- Existing codebase: `package.json` -- all dependency versions verified from installed packages
- CONTEXT.md decisions D-01 through D-19 -- all locked by user discussion

### Secondary (MEDIUM confidence)
- Next.js 15 middleware API -- based on training data for Next.js 15.x middleware patterns, consistent with project's Next.js 15.5.14 version
- @tanstack/react-table + shadcn data-table pattern -- standard pattern documented in shadcn docs
- CldUploadWidget API -- based on next-cloudinary documentation

### Tertiary (LOW confidence)
- None -- all patterns are established in the existing codebase or documented in official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed except @tanstack/react-table (which is specified in CLAUDE.md tech stack)
- Architecture: HIGH -- follows existing patterns from Phases 1-3, all decisions locked in CONTEXT.md
- Pitfalls: HIGH -- identified from actual codebase patterns (zod/v4 import, price-as-string, Windows path issues)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- all decisions locked, no fast-moving dependencies)
