import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="https://res.cloudinary.com/dmz3werfw/image/upload/f_auto,q_auto,w_1920/colored-bracelets_nzyvgb"
        alt="Beads & Bloom handmade bracelets"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[700px] px-4 text-center animate-fade-up">
        <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-7xl drop-shadow-lg">
          Beads &amp; Bloom
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-white/80">
          Handmade ocean-inspired jewelry by twin sisters.
          $1 from every order goes to charity.
        </p>
        <div className="mt-8">
          <Link
            href="/#shop"
            className="inline-flex h-12 items-center rounded-full px-9 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.05] hover:shadow-xl"
            style={{ backgroundColor: "#7BA7CC" }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
