import { Badge } from "@/components/ui/badge";
import type { Availability } from "@/types";

const labels: Record<Availability, string> = {
  ready_to_ship: "Ready to ship",
  made_to_order: "Made to order (5-7 days)",
};

export function AvailabilityBadge({
  availability,
}: {
  availability: Availability;
}) {
  return (
    <Badge
      variant="secondary"
      className="text-[14px] font-semibold text-muted-foreground"
    >
      {labels[availability]}
    </Badge>
  );
}
