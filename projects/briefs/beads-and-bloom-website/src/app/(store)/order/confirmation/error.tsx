"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
        <Link href="/" className={buttonVariants()}>
          Back to Shop
        </Link>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline" })}
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
