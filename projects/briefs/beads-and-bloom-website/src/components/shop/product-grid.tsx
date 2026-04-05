import Link from "next/link";
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

  // Show first 4 products as "New Arrivals" on homepage
  const newArrivals = products.slice(0, 4);

  return (
    <div>
      {/* New Arrivals */}
      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">New Arrivals</h2>
          <Link
            href="#all-products"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "#7BA7CC" }}
          >
            Shop All &rarr;
          </Link>
        </div>
        <div className="stagger-children grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FullProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="stagger-children grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
