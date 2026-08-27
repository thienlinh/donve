import { Skeleton } from "@dv/ui/components/shadcn/skeleton";

/**
 * Grid of card-shaped placeholders — thumbnail + a couple of text lines. Shared by any view
 * that loads into a card grid (landing pages gallery, template pickers): same rhythm as the
 * real cards without hardcoding each consumer's exact markup.
 */
export function CardGridSkeleton({
  count = 8,
  gridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  withThumbnail = true
}: {
  count?: number;
  gridClassName?: string;
  withThumbnail?: boolean;
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border p-3">
          {withThumbnail && <Skeleton className="aspect-video w-full" />}
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
