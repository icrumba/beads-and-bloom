import { redirect } from "next/navigation";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { CheckCircle, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  let session;
  let lineItems;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
    lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
  } catch {
    redirect("/");
  }

  if (session.status !== "complete") {
    redirect("/");
  }

  const shippingAddress = session.metadata?.shipping_address
    ? JSON.parse(session.metadata.shipping_address)
    : null;

  const customerName = session.metadata?.customer_name || "Friend";

  // Filter out shipping from display items
  const purchasedItems = lineItems.data.filter(
    (item) => item.description !== "Flat-rate shipping"
  );
  const totalInDollars = session.amount_total
    ? (session.amount_total / 100).toFixed(2)
    : "0.00";

  return (
    <div className="mx-auto max-w-[600px] px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="size-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">
          Thank you! Your order is on its way.
        </h1>
        <p className="text-muted-foreground">
          We&apos;re so excited to make this for you, {customerName}!
        </p>
      </div>

      {/* Order items */}
      <div className="rounded-lg border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-3">Your Order</h2>
        <div className="space-y-2">
          {purchasedItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.description}
                {(item.quantity ?? 1) > 1 && ` x${item.quantity}`}
              </span>
              <span>
                ${item.amount_total ? (item.amount_total / 100).toFixed(2) : "0.00"}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-sm font-semibold mt-1.5 pt-1.5 border-t">
              <span>Total</span>
              <span>${totalInDollars}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {shippingAddress && (
        <div className="rounded-lg border p-4 mb-4">
          <h2 className="text-sm font-semibold mb-2">Shipping To</h2>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.line1}
            {shippingAddress.line2 && `, ${shippingAddress.line2}`}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.zip}
          </p>
        </div>
      )}

      {/* Special callouts */}
      <div className="space-y-3 mb-8">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <Package className="size-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Every order includes a handwritten thank-you note.
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Each piece is made with love and packed with care.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-pink-50 border border-pink-200 p-4 flex items-start gap-3">
          <Heart className="size-5 text-pink-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-pink-900">
              $1 from your purchase is being donated to The Storehouse.
            </p>
            <p className="text-xs text-pink-700 mt-1">
              Thank you for helping us give back to our community!
            </p>
          </div>
        </div>
      </div>

      {/* Estimated delivery */}
      <div className="rounded-lg bg-muted/50 p-4 mb-8 text-center">
        <p className="text-sm font-medium">Estimated Delivery</p>
        <p className="text-sm text-muted-foreground mt-1">
          5-10 business days
        </p>
      </div>

      <div className="text-center">
        <Link href="/">
          <Button size="lg" className="h-11 text-base">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
