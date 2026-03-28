import type { Availability } from "@/types";

const config: Record<Availability, { label: string; dot: string }> = {
  ready_to_ship: { label: "Ready to ship", dot: "bg-emerald-400" },
  made_to_order: { label: "Made to order", dot: "bg-amber-400" },
};

export function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  const { label, dot } = config[availability];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
