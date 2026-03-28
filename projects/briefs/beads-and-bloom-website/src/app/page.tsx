import { Suspense } from "react";
import { getProducts, getFeaturedProducts, getCharityTotal } from "@/lib/queries";
import { HeroSection } from "@/components/shared/hero-section";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid } from "@/components/shop/product-grid";
import { CharityCounter } from "@/components/shared/charity-counter";

export const dynamic = "force-dynamic";

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

  let charityTotal = 0;
  try {
    const charityData = await getCharityTotal();
    charityTotal = parseFloat(charityData.totalDonated) || 0;
  } catch {
    // DB not configured yet -- default to 0
  }

  return (
    <>
      <HeroSection />

      <div id="shop" className="mx-auto max-w-[1200px] px-4">
        <div className="mt-16 md:mt-20">
          <Suspense fallback={null}>
            <CategoryTabs active={activeCategory} />
          </Suspense>
        </div>

        <div className="mt-8">
          <ProductGrid products={products} featured={featured} />
        </div>

        <div className="mt-20 md:mt-28">
          <CharityCounter total={charityTotal} />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-20" />
    </>
  );
}
