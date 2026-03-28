const stats = [
  { num: "1,200+", label: "families served weekly", icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66" },
  { num: "166,000+", label: "individuals served yearly", icon: "\uD83E\uDD1D" },
  { num: "3.3M+", label: "meals provided last year", icon: "\uD83C\uDF7D\uFE0F" },
  { num: "$1", label: "donated every purchase", icon: "\uD83D\uDC9A" },
];

export function GivingBack() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* Soft background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent" />

      <div className="relative mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-14 text-center animate-fade-up">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-600">
            Our Charity Partner
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Feeding families through{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              The Storehouse
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            The Storehouse Community Center supports North Dallas neighbors with
            food, clothing, resources, and education. They&apos;re one of the
            North Texas Food Bank&apos;s largest traditional pantry partners
            &mdash; and every bracelet you buy helps them keep going.
          </p>
        </div>

        {/* Stats grid */}
        <div className="stagger-children mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl border border-emerald-100 bg-white/80 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100/50"
            >
              <span className="mb-2 block text-2xl">{s.icon}</span>
              <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {s.num}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="animate-fade-up overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 to-slate-700 p-8 md:flex md:items-center md:justify-between md:p-10">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold text-white md:text-2xl">
              Learn more about The Storehouse
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
              Feeding together. Clothing together. Caring together. See how
              they&apos;re transforming lives in North Dallas.
            </p>
          </div>
          <a
            href="https://www.thestorehousecc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-slate-800 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
          >
            Visit thestorehousecc.org
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
