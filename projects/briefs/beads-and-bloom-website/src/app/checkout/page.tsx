"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useHydratedStore } from "@/lib/use-hydrated-store";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { StripeCheckout } from "@/components/checkout/stripe-checkout";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const items = useHydratedStore(() => useCartStore.getState().items, []);
  const giftMessage = useHydratedStore(
    () => useCartStore.getState().giftMessage,
    ""
  );
  const subtotal = useHydratedStore(
    () => useCartStore.getState().totalPrice(),
    0
  );

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShoppingBag className="size-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some beautiful jewelry to get started!
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Continue shopping
        </Link>
        <h1 className="text-2xl font-semibold">Checkout</h1>
      </div>

      {clientSecret ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete your payment below. You&apos;ll be redirected to your order
            confirmation after payment.
          </p>
          <StripeCheckout clientSecret={clientSecret} />
        </div>
      ) : (
        <CheckoutForm
          items={items}
          giftMessage={giftMessage}
          subtotal={subtotal}
          onClientSecret={setClientSecret}
        />
      )}
    </div>
  );
}
