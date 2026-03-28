import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info -- Beads & Bloom",
  description:
    "Flat-rate shipping on all Beads & Bloom orders. Learn about our shipping times and delivery details.",
};

const sections = [
  {
    title: "Flat-Rate Shipping",
    body: "$5 flat rate on all orders -- no surprises at checkout.",
  },
  {
    title: "Processing Time",
    body: "Ready-to-ship items go out in 1-2 business days. Made-to-order pieces take 5-7 business days to craft, plus 1-2 days for shipping.",
  },
  {
    title: "Delivery",
    body: "We ship via standard USPS. Once your order is on its way, expect delivery in 3-5 business days.",
  },
  {
    title: "Tracking",
    body: "You'll receive a tracking number by email as soon as your order ships so you can follow it every step of the way.",
  },
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[600px] px-4 pt-12 pb-12">
      <h1 className="text-[24px] font-semibold">Shipping Info</h1>

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
