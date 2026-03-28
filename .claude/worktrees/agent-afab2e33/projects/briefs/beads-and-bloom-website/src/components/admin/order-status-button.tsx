"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { advanceOrderStatus } from "@/actions/orders";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const nextStatusLabels: Record<string, string> = {
  new: "Start Making",
  confirmed: "Start Making",
  making: "Mark Shipped",
  shipped: "Mark Delivered",
};

export function OrderStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "delivered") {
    return (
      <span className="text-xs text-stone-400">Delivered</span>
    );
  }

  const label = nextStatusLabels[currentStatus] ?? "Advance";

  function handleClick() {
    startTransition(async () => {
      const result = await advanceOrderStatus(orderId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Status updated to ${result.newStatus}`);
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="min-h-[44px] text-xs"
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        label
      )}
    </Button>
  );
}
