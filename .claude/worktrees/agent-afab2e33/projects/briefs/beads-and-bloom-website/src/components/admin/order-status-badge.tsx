import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-700",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-700",
  },
  making: {
    label: "Making",
    className: "bg-amber-100 text-amber-700",
  },
  shipped: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-700",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
