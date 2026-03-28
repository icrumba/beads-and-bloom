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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl">🐚</span>
        <h2 className="mt-3 text-xl font-semibold">Nothing here yet!</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
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
        <div className="mb-3 md:mb-5 animate-fade-up">
          <ProductCard product={featured} featured />
        </div>
      )}
      <div className="stagger-children grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {gridProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
