import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, customers, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, 1));
    if (!order) return NextResponse.json({ error: "No order #1" });

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
      .where(eq(orderItems.orderId, 1));

    const customer = order.customerId
      ? (await db.select().from(customers).where(eq(customers.id, order.customerId)))[0]
      : null;

    return NextResponse.json({
      ok: true,
      order: { id: order.id, status: order.status, totalAmount: order.totalAmount, createdAt: order.createdAt, shippingAddress: order.shippingAddress },
      items,
      customer,
    });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) });
  }
}
