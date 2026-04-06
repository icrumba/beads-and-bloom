"use client";

import { CldImage } from "next-cloudinary";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { getColor } from "@/components/shop/color-swatches";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const lineTotal = (parseFloat(item.price) * item.quantity).toFixed(2);

  return (
    <div className="flex gap-3 py-3">
      {/* Product image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.image ? (
          <CldImage
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium leading-tight">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              ${parseFloat(item.price).toFixed(2)}
            </p>
          </div>
          <p className="text-sm font-medium">${lineTotal}</p>
        </div>

        {/* Size */}
        {item.size && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Size: {item.size}
          </p>
        )}

        {/* Custom colors */}
        {item.customColors && item.customColors.length > 0 && (
          <div className="mt-1 flex items-center gap-1">
            {item.customColors.map((c) => (
              <span
                key={c}
                className="inline-block h-2.5 w-2.5 rounded-full border border-border/50"
                style={{ backgroundColor: getColor(c) }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Quantity controls */}
        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => {
              if (item.quantity === 1) {
                removeItem(item.productId, item.customColors);
              } else {
                updateQuantity(
                  item.productId,
                  item.quantity - 1,
                  item.customColors
                );
              }
            }}
            aria-label={
              item.quantity === 1 ? "Remove item" : "Decrease quantity"
            }
          >
            {item.quantity === 1 ? (
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
          </Button>

          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() =>
              updateQuantity(
                item.productId,
                item.quantity + 1,
                item.customColors
              )
            }
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
