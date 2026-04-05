"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ConfirmationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Order confirmation error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">📦</p>
      <h1 className="mt-4 text-2xl font-semibold">
        Trouble loading your confirmation
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Don&apos;t worry -- if your payment went through, you&apos;ll receive a
        confirmation email.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Back to Shop
        </Link>
        <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          Contact us
        </Link>
      </div>
    </div>
  );
}
