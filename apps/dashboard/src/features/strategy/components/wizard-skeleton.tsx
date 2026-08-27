import { Skeleton } from "@dv/ui/components/shadcn/skeleton";

/**
 * Shared loading shape for the Business/Strategy/Architecture wizard steps — same
 * `max-w-3xl` shell and stacked bordered sections all three pages render once loaded, so the
 * skeleton doesn't visibly jump when the real content swaps in.
 */
export function WizardSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex flex-col gap-6">
        {Array.from({ length: sections }, (_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-md border p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
