import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Page title */}
      <Skeleton className="h-8 w-48" />

      {/* Status filter tabs */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Order table rows */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
