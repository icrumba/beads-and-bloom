import { db } from "@/db";
import { products, charityTotals, orders, orderItems, customers } from "@/db/schema";
import { eq, and, asc, desc, sql } from "drizzle-orm";
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

// --- Public order tracking ---

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

// --- Admin queries ---

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
    return baseQuery.where(eq(orders.status, status as "new" | "confirmed" | "making" | "shipped" | "delivered"));
  }
  return baseQuery;
}

// Full order detail with items
export async function getOrderDetail(orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      customColors: orderItems.customColors,
      productName: products.name,
      productImages: products.images,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  const customer = order.customerId
    ? (await db.select().from(customers).where(eq(customers.id, order.customerId)))[0]
    : null;

  return { ...order, items, customer };
}

// All products for admin (including out of stock)
export async function getAllProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

// Single product by ID
export async function getProductById(id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}

// All customers with order counts
export async function getAdminCustomers() {
  return db.select().from(customers).orderBy(desc(customers.createdAt));
}
