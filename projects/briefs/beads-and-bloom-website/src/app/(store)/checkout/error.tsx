"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Checkout error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">💳</p>
      <h1 className="mt-4 text-2xl font-semibold">Payment trouble</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We had trouble processing your payment. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Return to cart
        </Link>
      </div>
    </div>
  );
}
