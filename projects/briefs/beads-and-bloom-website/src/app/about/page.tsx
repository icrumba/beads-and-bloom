import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story -- Beads & Bloom",
  description:
    "Meet the 13-year-old twin sisters behind Beads & Bloom. Handmade ocean-inspired jewelry that feeds families through The Storehouse.",
};

const stories = [
  {
    tagline: "How It Started",
    title: "A rainy day. A bag of beads. A friendship bracelet that changed everything.",
    body: "We're twin sisters who fell in love with making jewelry one summer at the beach. What started as a rainy-day craft project quickly became our favorite thing to do together. We started giving bracelets to friends, then friends-of-friends started asking for them, and before we knew it \u2014 Beads & Bloom was born.",
    color: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
  },
  {
    tagline: "The Craft",
    title: "Every bead picked with care. Every bracelet made with heart.",
    body: "Every single piece is handmade by us. We carefully pick each bead, charm, and color combination. Our materials are high-quality and durable \u2014 because jewelry should last, especially when it means something to you. From sea turtle charms to starfish pendants, every piece carries a little bit of the ocean with it.",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
  },
  {
    tagline: "Giving Back",
    title: "Because making a difference shouldn\u2019t have to wait until you\u2019re older.",
    body: "Every bracelet we sell donates $1 to The Storehouse Community Center \u2014 one of North Dallas\u2019s largest food pantry partners, serving over 1,200 families every week. We believe that even small actions add up to something big, and we want every purchase to make you feel good \u2014 not just because you got something beautiful, but because you helped feed a family in need.",
    color: "from-rose-500 to-orange-500",
    bgLight: "bg-rose-50",
  },
  {
    tagline: "Ocean Inspired",
    title: "A little piece of the coast you can carry anywhere.",
    body: "The ocean is where we feel most at home. Sea turtles, starfish, shells, and waves \u2014 they all inspire our designs. We want our jewelry to remind you of sunny beach days, salty air, and the calm feeling you get watching the waves roll in. Every piece is a little piece of the coast you can carry with you anywhere.",
    color: "from-blue-500 to-indigo-500",
    bgLight: "bg-blue-50",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      {/* Page heading */}
      <div className="mb-16 text-center animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">
          Our Story
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Making the world more beautiful &mdash;{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent">
            one bracelet at a time.
          </span>
        </h1>
        <div className="mx-auto mt-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400" />
      </div>

      {/* Story cards */}
      <div className="stagger-children space-y-8">
        {stories.map((s) => (
          <div
            key={s.tagline}
            className="group rounded-2xl border border-border/50 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04]"
          >
            <span
              className={`inline-block bg-gradient-to-r ${s.color} bg-clip-text text-xs font-bold uppercase tracking-widest text-transparent`}
            >
              {s.tagline}
            </span>
            <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight">
              {s.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* Storehouse CTA */}
      <div className="mt-16 animate-fade-up overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-center md:p-10">
        <p className="text-sm font-medium uppercase tracking-widest text-white/60">
          Our Charity Partner
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          The Storehouse Community Center
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
          Feeding together. Clothing together. Caring together. The Storehouse
          serves over 1,200 families weekly and provided 3.3 million meals last
          year. Every bracelet you buy helps them keep going.
        </p>
        <a
          href="https://www.thestorehousecc.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-slate-800 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
        >
          Visit thestorehousecc.org
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
