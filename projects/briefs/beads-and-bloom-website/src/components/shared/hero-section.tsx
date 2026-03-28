import Link from "next/link";

export function HeroSection() {
  return (
    <section className="gradient-hero relative overflow-hidden px-4 py-20 md:py-28">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-12 h-56 w-56 rounded-full bg-pink-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-amber-100/20 blur-3xl" />

      <div className="relative mx-auto max-w-[640px] text-center animate-fade-up">
        <p className="text-sm font-medium uppercase tracking-widest text-primary/80">
          Handmade ocean-inspired jewelry
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
          Made with love.
          <br />
          <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            Every purchase gives back.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          $1 from every order feeds families through{" "}
          <strong className="text-foreground">The Storehouse</strong> &mdash;
          North Dallas&apos;s largest food pantry partner.
        </p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
          <span>&#127793;</span>
          1,200+ families served weekly
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/#shop"
            className="inline-flex h-11 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center rounded-full border border-border px-7 text-sm font-semibold transition-all duration-200 hover:bg-secondary"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
