"use server";

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

  if (!order) {
    return { error: "Order not found" };
  }

  // Treat "confirmed" as same position as "new" (index 0)
  const currentStatus = order.status === "confirmed" ? "new" : order.status;
  const currentIdx = statusFlow.indexOf(
    currentStatus as (typeof statusFlow)[number]
  );

  if (currentIdx === -1) {
    return { error: "Unknown order status" };
  }

  if (currentIdx === statusFlow.length - 1) {
    return { error: "Order is already delivered" };
  }

  const nextStatus = statusFlow[currentIdx + 1];

  await db
    .update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + orderId);

  return { success: true, newStatus: nextStatus };
}
