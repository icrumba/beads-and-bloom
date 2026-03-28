"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mt-4 text-2xl font-semibold">
        Something went wrong loading this page
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Try refreshing, or head back to the dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link
          href="/admin"
          className={buttonVariants({ variant: "outline" })}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
