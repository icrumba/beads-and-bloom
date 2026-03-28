import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

export function ProductGrid({
  products,
  featured,
}: {
  products: Product[];
  featured?: Product;
}) {
  if (products.length === 0 && !featured) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-semibold">Nothing here yet!</h2>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          We&apos;re working on new pieces for this collection. Check out our
          other jewelry in the meantime!
        </p>
      </div>
    );
  }

  const gridProducts = featured
    ? products.filter((p) => p.id !== featured.id)
    : products;

  return (
    <div>
      {featured && (
        <div className="mb-2 md:mb-4">
          <ProductCard product={featured} featured />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {gridProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
