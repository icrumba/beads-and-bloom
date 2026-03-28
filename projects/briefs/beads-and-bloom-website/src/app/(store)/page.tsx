import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getFeaturedProducts, getCharityTotal } from "@/lib/queries";
import { HeroSection } from "@/components/shared/hero-section";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid } from "@/components/shop/product-grid";
import { CharityCounter } from "@/components/shared/charity-counter";
import { GivingBack } from "@/components/shared/giving-back";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
  description:
    "Handmade jewelry by teen twin sisters. Every purchase donates $1 to charity. Sea turtle, starfish, and shell charm bracelets and necklaces.",
  openGraph: {
    title: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
    description:
      "Handmade jewelry by teen twin sisters. Every purchase donates $1 to charity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beads & Bloom -- Handmade Ocean-Inspired Jewelry",
    description:
      "Handmade jewelry by teen twin sisters. Every purchase donates $1 to charity.",
    images: ["/og-image.png"],
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "all";

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let featuredProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let charityTotal = 0;

  try {
    [products, featuredProducts] = await Promise.all([
      getProducts(activeCategory),
      getFeaturedProducts(),
    ]);
  } catch {
    // DB not available -- show empty store
  }

  const featured = featuredProducts[0] ?? products[0] ?? undefined;

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

      <GivingBack />

      <div className="h-8" />
    </>
  );
}
