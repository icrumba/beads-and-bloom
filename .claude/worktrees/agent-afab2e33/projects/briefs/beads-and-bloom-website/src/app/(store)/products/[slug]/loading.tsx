import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-4">
      {/* Back link skeleton */}
      <Skeleton className="mb-4 h-5 w-28" />

      <div className="md:flex md:gap-8">
        {/* Photo carousel skeleton */}
        <div className="md:w-1/2 lg:w-[55%]">
          <Skeleton className="aspect-square w-full rounded-lg" />
          {/* Thumbnail dots */}
          <div className="mt-3 flex justify-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="mt-6 md:mt-0 md:w-1/2 lg:w-[45%]">
          {/* Product name */}
          <Skeleton className="h-8 w-3/4" />
          {/* Price */}
          <Skeleton className="mt-2 h-6 w-24" />
          {/* Availability badge */}
          <Skeleton className="mt-3 h-6 w-32 rounded-full" />
          {/* Separator */}
          <Skeleton className="my-4 h-px w-full" />
          {/* Description lines */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          {/* Add to cart button */}
          <Skeleton className="mt-6 h-12 w-full md:w-40" />
        </div>
      </div>
    </div>
  );
}
