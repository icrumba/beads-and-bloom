import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">🐚</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn&apos;t find what you&apos;re looking for. It may have washed
        away with the tide.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
        >
          Browse our jewelry
        </Link>
      </div>
    </div>
  );
}
