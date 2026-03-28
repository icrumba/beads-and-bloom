"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColorSwatches } from "@/components/shop/color-swatches";
import { useCartStore } from "@/lib/cart-store";

type AddToCartButtonProps = {
  productId: number;
  name: string;
  price: string;
  image: string;
  slug: string;
  colors: string[];
  customizable: boolean;
};

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  slug,
  colors,
  customizable,
}: AddToCartButtonProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAdd() {
    addItem({
      productId,
      name,
      price,
      image,
      slug,
      customColors: customizable && selectedColors.length > 0
        ? selectedColors
        : undefined,
    });
    toast.success("Added to cart!");
    openCart();
  }

  return (
    <div className="space-y-4">
      {customizable && colors.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-2">Choose your colors</h2>
          <ColorSwatches
            colors={colors}
            interactive
            selected={selectedColors}
            onSelect={setSelectedColors}
          />
        </div>
      )}

      {!customizable && colors.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-2">Colors</h2>
          <ColorSwatches colors={colors} />
        </div>
      )}

      <Button size="lg" className="w-full md:w-auto" onClick={handleAdd}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}
