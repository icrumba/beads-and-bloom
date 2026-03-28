"use client";

import Link from "next/link";
import { Shell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { CartItem } from "@/components/cart/cart-item";
import { GiftMessage } from "@/components/cart/gift-message";

const FLAT_SHIPPING = 5.0;
const FREE_SHIPPING_THRESHOLD = 25;

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);

  const subtotal = totalPrice();
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const itemCount = totalItems();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            Your Cart {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
            <Shell className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <Button
              variant="outline"
              size="sm"
              onClick={closeCart}
              render={<Link href="/" />}
            >
              Start browsing
            </Button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${(item.customColors || []).sort().join(",")}`}
                >
                  <CartItem item={item} />
                  <Separator />
                </div>
              ))}

              {/* Gift message */}
              <div className="py-4">
                <GiftMessage />
              </div>
            </div>

            {/* Footer with totals */}
            <SheetFooter className="border-t border-border/50">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {!isFreeShipping && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={items.length === 0}
                  onClick={closeCart}
                  render={<Link href="/checkout" />}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
