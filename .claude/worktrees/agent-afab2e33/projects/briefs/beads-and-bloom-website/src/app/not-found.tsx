import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
        <Link href="/products" className={buttonVariants()}>
          Browse our jewelry
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          or go home
        </Link>
      </div>
    </div>
  );
}
