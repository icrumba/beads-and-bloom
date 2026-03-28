import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story -- Beads & Bloom",
  description:
    "Meet the 13-year-old twin sisters behind Beads & Bloom. Handmade ocean-inspired jewelry that gives back with every purchase.",
};

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-secondary aspect-[3/2] w-full">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Page heading */}
      <h1 className="text-[24px] font-semibold text-center md:text-left">
        Our Story
      </h1>
      <p className="mt-2 text-base text-muted-foreground text-center md:text-left">
        Making the world more beautiful -- one bracelet at a time.
      </p>

      {/* Section 1: Story intro (text left, image right on desktop) */}
      <section className="py-12 md:flex md:items-center md:gap-8">
        <div className="max-w-[500px] mb-6 md:mb-0 md:w-1/2">
          <h2 className="text-[14px] font-semibold mb-3">How It Started</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            We&apos;re twin sisters who fell in love with making jewelry one
            summer at the beach. What started as a rainy-day craft project
            quickly became our favorite thing to do together. We started giving
            bracelets to friends, then friends-of-friends started asking for
            them, and before we knew it -- Beads &amp; Bloom was born.
          </p>
        </div>
        <div className="md:w-1/2">
          <ImagePlaceholder label="Photo coming soon" />
        </div>
      </section>

      {/* Section 2: The craft (image left, text right on desktop) */}
      <section className="py-12 md:flex md:flex-row-reverse md:items-center md:gap-8">
        <div className="max-w-[500px] mb-6 md:mb-0 md:w-1/2">
          <h2 className="text-[14px] font-semibold mb-3">The Craft</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every single piece is handmade by us. We carefully pick each bead,
            charm, and color combination. Our materials are high-quality and
            durable -- because jewelry should last, especially when it means
            something to you. From sea turtle charms to starfish pendants, every
            piece carries a little bit of the ocean with it.
          </p>
        </div>
        <div className="md:w-1/2">
          <ImagePlaceholder label="Photo coming soon" />
        </div>
      </section>

      {/* Section 3: The charity mission (text left, image right on desktop) */}
      <section className="py-12 md:flex md:items-center md:gap-8">
        <div className="max-w-[500px] mb-6 md:mb-0 md:w-1/2">
          <h2 className="text-[14px] font-semibold mb-3">Giving Back</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every bracelet we sell donates $1 to charity. Because giving back
            shouldn&apos;t have to wait until you&apos;re older. We believe that
            even small actions add up to something big, and we want every
            purchase to make you feel good -- not just because you got something
            beautiful, but because you helped make a difference too.
          </p>
        </div>
        <div className="md:w-1/2">
          <ImagePlaceholder label="Photo coming soon" />
        </div>
      </section>

      {/* Section 4: The ocean connection (image left, text right on desktop) */}
      <section className="py-12 md:flex md:flex-row-reverse md:items-center md:gap-8">
        <div className="max-w-[500px] mb-6 md:mb-0 md:w-1/2">
          <h2 className="text-[14px] font-semibold mb-3">
            Ocean Inspired
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            The ocean is where we feel most at home. Sea turtles, starfish,
            shells, and waves -- they all inspire our designs. We want our
            jewelry to remind you of sunny beach days, salty air, and the calm
            feeling you get watching the waves roll in. Every piece is a little
            piece of the coast you can carry with you anywhere.
          </p>
        </div>
        <div className="md:w-1/2">
          <ImagePlaceholder label="Photo coming soon" />
        </div>
      </section>
    </div>
  );
}
