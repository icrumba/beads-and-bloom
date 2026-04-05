import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getCharityTotal } from "@/lib/queries";
import { HeroSection } from "@/components/shared/hero-section";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ProductGrid, FullProductGrid } from "@/components/shop/product-grid";
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

  let allProducts: Awaited<ReturnType<typeof getProducts>> = [];
  let filteredProducts: Awaited<ReturnType<typeof getProducts>> = [];
  let charityTotal = 0;

  try {
    // Always get all products for New Arrivals
    allProducts = await getProducts("all");
    // Get filtered products for All Products section
    filteredProducts = activeCategory === "all" ? allProducts : await getProducts(activeCategory);
  } catch {
    // DB not available -- show empty store
  }

  try {
    const charityData = await getCharityTotal();
    charityTotal = parseFloat(charityData.totalDonated) || 0;
  } catch {
    // DB not configured yet -- default to 0
  }

  return (
    <>
      <HeroSection />

      {/* New Arrivals Section — always shows same products */}
      <div id="shop" className="mx-auto max-w-[1200px] px-4">
        <div className="mt-16 md:mt-20">
          <ProductGrid products={allProducts} />
        </div>

        {/* Charity Counter */}
        <div className="mt-16 md:mt-20">
          <CharityCounter total={charityTotal} />
        </div>
      </div>

      <GivingBack />

      {/* Full Shop Section — filtered by category */}
      <div id="all-products" className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">All Products</h2>
          <p className="mt-2 text-muted-foreground">
            Browse our full collection of handmade ocean-inspired jewelry
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={null}>
            <CategoryTabs active={activeCategory} />
          </Suspense>
        </div>

        <FullProductGrid products={filteredProducts} />
      </div>

      <div className="h-8" />
    </>
  );
}
