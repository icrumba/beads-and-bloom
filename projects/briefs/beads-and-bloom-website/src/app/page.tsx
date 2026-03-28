import { Suspense } from "react";
import { getProducts, getFeaturedProducts } from "@/lib/queries";
import { HeroSection } from "@/components/shared/hero-section";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid } from "@/components/shop/product-grid";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "all";

  const [products, featuredProducts] = await Promise.all([
    getProducts(activeCategory),
    getFeaturedProducts(),
  ]);

  const featured = featuredProducts[0] ?? products[0] ?? undefined;

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mt-12">
          <Suspense fallback={null}>
            <CategoryTabs active={activeCategory} />
          </Suspense>
        </div>

        <div className="mt-6">
          <ProductGrid products={products} featured={featured} />
        </div>
      </div>
    </>
  );
}
