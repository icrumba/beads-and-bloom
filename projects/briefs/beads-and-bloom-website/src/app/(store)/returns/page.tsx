import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges -- Beads & Bloom",
  description:
    "Our return and exchange policy for handmade jewelry. We want you to love your purchase.",
};

const sections = [
  {
    title: "Our Promise",
    body: "We want you to absolutely love your jewelry. If something isn't right, we'll make it right.",
  },
  {
    title: "Returns",
    body: "If you're not happy with your order, reach out within 14 days of delivery. We'll work with you on a return or exchange.",
  },
  {
    title: "Made-to-Order Items",
    body: "Since made-to-order pieces are crafted just for you, we can't accept returns on these unless there's a defect. We'll always fix defects for free!",
  },
  {
    title: "How to Start a Return",
    body: "Just email us or DM us on Instagram and we'll take care of everything.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-[600px] px-4 pt-12 pb-12">
      <h1 className="text-[24px] font-semibold">Returns &amp; Exchanges</h1>

      <div className="mt-8 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg bg-card p-6">
            <h2 className="text-[14px] font-semibold">{section.title}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
