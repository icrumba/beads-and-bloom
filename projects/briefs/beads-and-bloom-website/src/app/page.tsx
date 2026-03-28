import { Suspense } from "react";
import { getProducts, getFeaturedProducts, getCharityTotal } from "@/lib/queries";
import { HeroSection } from "@/components/shared/hero-section";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid } from "@/components/shop/product-grid";
import { CharityCounter } from "@/components/shared/charity-counter";
import { InstagramGallery } from "@/components/shared/instagram-gallery";

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

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mt-12">
          <Suspense fallback={null}>
            <CategoryTabs active={activeCategory} />
          </Suspense>
        </div>

        <div className="mt-6">
          <ProductGrid products={products} featured={featured} />
        </div>

        {/* Charity Counter Section */}
        <div className="mt-12">
          <CharityCounter total={charityTotal} />
        </div>

        {/* Instagram Gallery Section */}
        <div className="mt-12">
          <InstagramGallery />
        </div>
      </div>
    </>
  );
}
