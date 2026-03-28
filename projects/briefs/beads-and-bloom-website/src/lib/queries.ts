import { db } from "@/db";
import { products, charityTotals, orders, orderItems, customers } from "@/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import type { Address } from "@/types";

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

// --- Order creation and customer management ---

export async function createOrder(data: {
  stripeSessionId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: Address;
  giftMessage?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: string;
    customColors?: string[];
  }[];
  totalAmount: string;
}) {
  // 1. Upsert customer by email
  const [customer] = await db
    .insert(customers)
    .values({
      email: data.customerEmail,
      name: data.customerName,
      phone: data.customerPhone,
      address: data.shippingAddress,
      orderCount: 1,
    })
    .onConflictDoUpdate({
      target: customers.email,
      set: {
        name: data.customerName,
        phone: data.customerPhone,
        address: data.shippingAddress,
        orderCount: sql`${customers.orderCount} + 1`,
      },
    })
    .returning();

  // 2. Insert order record
  const [order] = await db
    .insert(orders)
    .values({
      stripeSessionId: data.stripeSessionId,
      customerId: customer.id,
      status: "new",
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      giftMessage: data.giftMessage,
    })
    .returning();

  // 3. Insert order items (batch)
  if (data.items.length > 0) {
    await db.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customColors: item.customColors,
      }))
    );
  }

  // 4. Increment charity counter ($1 per order)
  await db
    .update(charityTotals)
    .set({
      totalDonated: sql`${charityTotals.totalDonated} + 1`,
      orderCount: sql`${charityTotals.orderCount} + 1`,
      lastUpdated: new Date(),
    })
    .where(eq(charityTotals.id, 1));

  return order;
}

export async function getOrderByStripeSession(sessionId: string) {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId))
    .limit(1);
  return result[0] ?? null;
}
