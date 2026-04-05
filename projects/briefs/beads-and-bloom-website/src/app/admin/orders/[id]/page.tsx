import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/queries";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusButton } from "@/components/admin/order-status-button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, MapPin, Gift } from "lucide-react";
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

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderDetail(orderId);

  if (!order) {
    notFound();
  }

  const address = order.shippingAddress as {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft className="size-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-stone-900">
          Order #{order.id}
        </h1>
        <OrderStatusBadge status={order.status} />
        <OrderStatusButton orderId={order.id} currentStatus={order.status} />
      </div>

      <p className="text-sm text-stone-500">
        Placed on {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a") : "Unknown date"}
      </p>

      {/* Items */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Items
        </h2>
        <Separator className="my-3" />
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.productImages && (item.productImages as string[]).length > 0 ? (
                <img
                  src={`https://res.cloudinary.com/dmz3werfw/image/upload/w_128,h_128,c_fill,f_auto/${(item.productImages as string[])[0]}`}
                  alt={item.productName ?? "Product"}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">
                  No img
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-stone-900">
                  {item.productName ?? "Unknown Product"}
                </p>
                <p className="text-sm text-stone-500">
                  Qty: {item.quantity} x ${item.unitPrice}
                </p>
                {item.customColors && (item.customColors as string[]).length > 0 && (
                  <p className="text-sm text-teal-700">
                    Custom colors: {(item.customColors as string[]).join(", ")}
                  </p>
                )}
              </div>
              <p className="font-medium text-stone-900">
                ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-base font-semibold text-stone-900">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>
      </Card>

      {/* Customer */}
      {order.customer && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Customer
          </h2>
          <Separator className="my-3" />
          <div className="space-y-2">
            <p className="font-medium text-stone-900">{order.customer.name}</p>
            <a
              href={`mailto:${order.customer.email}`}
              className="flex items-center gap-2 text-sm text-teal-700 hover:underline"
            >
              <Mail className="size-4" />
              {order.customer.email}
            </a>
            {order.customer.phone && (
              <a
                href={`tel:${order.customer.phone}`}
                className="flex items-center gap-2 text-sm text-teal-700 hover:underline"
              >
                <Phone className="size-4" />
                {order.customer.phone}
              </a>
            )}
            {order.customer.orderCount > 0 && (
              <p className="text-sm text-stone-500">
                {order.customer.orderCount === 1
                  ? "1st order"
                  : order.customer.orderCount === 2
                    ? "2nd order"
                    : order.customer.orderCount === 3
                      ? "3rd order"
                      : `${order.customer.orderCount}th order`}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Shipping address */}
      {address && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            <MapPin className="mr-1 inline size-4" />
            Shipping Address
          </h2>
          <Separator className="my-3" />
          <div className="text-sm text-stone-700 leading-relaxed">
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
            <p>{address.country}</p>
          </div>
        </Card>
      )}

      {/* Gift message */}
      {order.giftMessage && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            <Gift className="mr-1 inline size-4" />
            Gift Message
          </h2>
          <Separator className="my-3" />
          <blockquote className="rounded-lg bg-teal-50 p-4 text-sm italic text-teal-800">
            &ldquo;{order.giftMessage}&rdquo;
          </blockquote>
        </Card>
      )}

      {/* Order info */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Order Info
        </h2>
        <Separator className="my-3" />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-500">Order Date</dt>
            <dd className="text-stone-900">
              {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy") : "Unknown"}
            </dd>
          </div>
          {order.stripeSessionId && (
            <div className="flex justify-between">
              <dt className="text-stone-500">Stripe Session</dt>
              <dd className="font-mono text-xs text-stone-600">
                {order.stripeSessionId.slice(0, 20)}...
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-stone-500">Status</dt>
            <dd>
              <OrderStatusBadge status={order.status} />
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
