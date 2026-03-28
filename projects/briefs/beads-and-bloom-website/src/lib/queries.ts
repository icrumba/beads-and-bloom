import { db } from "@/db";
import { products, charityTotals } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getProducts(category?: string) {
  const conditions = [eq(products.inStock, true)];
  if (category && category !== "all") {
    conditions.push(eq(products.category, category as string));
  }
  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.sortOrder));
}

export async function getProductBySlug(slug: string) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getFeaturedProducts() {
  return db
    .select()
    .from(products)
    .where(and(eq(products.featured, true), eq(products.inStock, true)))
    .orderBy(asc(products.sortOrder));
}

export async function getCharityTotal() {
  const result = await db.select().from(charityTotals).limit(1);
  return result[0] ?? { totalDonated: "0", orderCount: 0 };
}

// --- Admin queries ---

// All products for admin (including out of stock)
export async function getAllProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

// Single product by ID
export async function getProductById(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}
