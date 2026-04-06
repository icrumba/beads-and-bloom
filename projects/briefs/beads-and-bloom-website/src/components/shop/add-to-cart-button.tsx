"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColorSwatches } from "@/components/shop/color-swatches";
import { useCartStore } from "@/lib/cart-store";

const BRACELET_SIZES = [
  { value: '6"', label: '6 inch' },
  { value: '7"', label: '7 inch (recommended)' },
  { value: '8"', label: '8 inch' },
];

type AddToCartButtonProps = {
  productId: number;
  name: string;
  price: string;
  image: string;
  slug: string;
  colors: string[];
  customizable: boolean;
  inStock?: boolean;
  category?: string;
};

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  slug,
  colors,
  customizable,
  inStock = true,
  category,
}: AddToCartButtonProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const isBracelet = category === "bracelets";

  function handleAdd() {
    if (isBracelet && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      productId,
      name,
      price,
      image,
      slug,
      customColors: customizable && selectedColors.length > 0
        ? selectedColors
        : undefined,
      size: isBracelet ? selectedSize : undefined,
    });
    toast.success("Added to cart!");
    openCart();
  }

  return (
    <div className="space-y-4">
      {/* Size selector for bracelets */}
      {isBracelet && inStock && (
        <div>
          <h2 className="text-sm font-semibold mb-2">Select Size</h2>
          <div className="flex flex-wrap gap-2">
            {BRACELET_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedSize === size.value
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

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

      {inStock ? (
        <Button size="lg" className="w-full md:w-auto" onClick={handleAdd}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      ) : (
        <Button size="lg" className="w-full md:w-auto" disabled>
          Sold Out
        </Button>
      )}
    </div>
  );
}
