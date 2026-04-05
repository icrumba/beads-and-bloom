import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/queries";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusButton } from "@/components/admin/order-status-button";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order #${id} | Admin` };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) notFound();

  const order = await getOrderDetail(orderId);
  if (!order) notFound();

  const address = order.shippingAddress as {
    line1: string; line2?: string; city: string; state: string; zip: string; country: string;
  } | null;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back to Orders
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
        <OrderStatusButton orderId={order.id} currentStatus={order.status} />
      </div>

      <p className="text-sm text-muted-foreground">Placed on {orderDate}</p>

      {/* Items */}
      <div className="rounded-xl border p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</h2>
        <hr />
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{item.productName ?? "Unknown"}</p>
              <p className="text-muted-foreground">Qty: {item.quantity} x ${item.unitPrice}</p>
            </div>
            <p className="font-medium">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>
      </div>

      {/* Customer */}
      {order.customer && (
        <div className="rounded-xl border p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</h2>
          <hr />
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm">{order.customer.email}</p>
          {order.customer.phone && <p className="text-sm">{order.customer.phone}</p>}
        </div>
      )}

      {/* Shipping */}
      {address && (
        <div className="rounded-xl border p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping Address</h2>
          <hr />
          <p className="text-sm">{address.line1}</p>
          {address.line2 && <p className="text-sm">{address.line2}</p>}
          <p className="text-sm">{address.city}, {address.state} {address.zip}</p>
        </div>
      )}

      {/* Gift message */}
      {order.giftMessage && (
        <div className="rounded-xl border p-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gift Message</h2>
          <hr />
          <p className="text-sm italic">&ldquo;{order.giftMessage}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
