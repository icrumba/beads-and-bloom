"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { AvailabilityBadge } from "@/components/shop/availability-badge";
import { ColorSwatches } from "@/components/shop/color-swatches";
import type { Product } from "@/types";

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card
        className={`overflow-hidden bg-card p-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
          featured ? "col-span-full" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          {product.images[0] ? (
            <CldImage
              src={product.images[0]}
              alt={product.name}
              width={featured ? 800 : 400}
              height={featured ? 600 : 400}
              crop="fill"
              gravity="center"
              format="auto"
              quality="auto"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              }
              className="w-full object-cover"
            />
          ) : (
            <div
              className={`flex items-center justify-center bg-muted text-muted-foreground ${
                featured ? "aspect-[4/3]" : "aspect-square"
              }`}
            >
              No photo
            </div>
          )}
        </div>

        <CardContent className="flex flex-col gap-2 p-2">
          <h3
            className={`font-semibold leading-tight ${
              featured ? "text-2xl" : "text-base"
            }`}
          >
            {product.name}
          </h3>
          <p
            className={`font-semibold text-primary ${
              featured ? "text-base" : "text-sm"
            }`}
          >
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <AvailabilityBadge availability={product.availability} />
          <ColorSwatches colors={product.colors} />
        </CardContent>
      </Card>
    </Link>
  );
}
