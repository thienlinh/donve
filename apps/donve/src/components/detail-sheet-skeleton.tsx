import { Skeleton } from "@dv/ui/components/shadcn/skeleton";

/**
 * Shared shape for a detail sheet's loading state (lead detail, refund request detail): a
 * title/subtitle pair followed by a few field rows — close enough to the real layout that the
 * sheet doesn't visibly jump when data lands, without hardcoding every field per consumer.
 */
export function DetailSheetSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
