"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useHydratedStore } from "@/lib/use-hydrated-store";

export function CartIcon() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useHydratedStore(
    () => useCartStore.getState().totalItems(),
    0
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span
          suppressHydrationWarning
          className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
