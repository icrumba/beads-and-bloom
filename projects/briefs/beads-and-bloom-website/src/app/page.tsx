import { getCharityTotal } from "@/lib/queries";
import { CharityCounter } from "@/components/shared/charity-counter";
import { InstagramGallery } from "@/components/shared/instagram-gallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let charityTotal = 0;
  try {
    const charityData = await getCharityTotal();
    charityTotal = parseFloat(charityData.totalDonated) || 0;
  } catch {
    // DB not configured yet -- default to 0
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      {/* Placeholder for Hero, CategoryTabs, ProductGrid (added by Plan 02-02) */}
      <div className="py-12 text-center">
        <h1 className="text-[32px] font-semibold">Beads &amp; Bloom</h1>
        <p className="text-muted-foreground mt-2">
          Coming soon -- storefront building in progress
        </p>
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
  );
}
