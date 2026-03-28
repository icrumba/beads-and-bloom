"use client";

import { useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { AvailabilityBadge } from "@/components/shop/availability-badge";
import { ColorSwatches } from "@/components/shop/color-swatches";
import type { Product } from "@/types";

const PLACEHOLDER_COLORS: Record<string, string> = {
  bracelets: "from-cyan-100 to-blue-200",
  necklaces: "from-amber-100 to-yellow-200",
  accessories: "from-pink-100 to-rose-200",
};

function ImagePlaceholder({
  name,
  category,
  featured,
}: {
  name: string;
  category: string;
  featured: boolean;
}) {
  const gradient = PLACEHOLDER_COLORS[category] || "from-gray-100 to-gray-200";
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradient} ${
        featured ? "aspect-[4/3]" : "aspect-square"
      }`}
    >
      <span className="text-3xl">🐚</span>
      <span className="mt-1 px-3 text-center text-xs text-muted-foreground">
        {name}
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-1 ${
          featured ? "col-span-full" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          {product.images[0] && !imgError ? (
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
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImagePlaceholder
              name={product.name}
              category={product.category}
              featured={featured}
            />
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-col gap-1.5 p-3 md:p-4">
          <h3
            className={`font-semibold leading-tight ${
              featured ? "text-xl md:text-2xl" : "text-sm"
            }`}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p
              className={`font-semibold ${
                featured ? "text-lg" : "text-base"
              }`}
            >
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <AvailabilityBadge availability={product.availability} />
          </div>
          {product.colors.length > 0 && (
            <div className="mt-0.5">
              <ColorSwatches colors={product.colors} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
