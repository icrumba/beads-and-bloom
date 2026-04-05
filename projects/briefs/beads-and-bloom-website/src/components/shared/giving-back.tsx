export function GivingBack() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent" />

      <div className="relative mx-auto max-w-[700px] text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Every bracelet makes a difference
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
          We donate $1 from every order to{" "}
          <a
            href="https://www.thestorehousecc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-emerald-600"
          >
            The Storehouse Community Center
          </a>
          , which helps feed and support families right here in North Dallas.
          It&apos;s a small thing, but it adds up.
        </p>

        <div className="mt-8">
          <a
            href="https://www.thestorehousecc.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-7 text-sm font-semibold transition-all duration-200 hover:bg-secondary"
          >
            Learn about The Storehouse
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
