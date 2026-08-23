import { Button } from "@dv/ui/components/shadcn/button";

import * as m from "@/paraglide/messages.js";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "mt-4 flex items-center justify-center gap-3"
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {m.commonPrevious()}
      </Button>
      <span className="text-sm text-muted-foreground">
        {m.commonPaginationLabel({ page, total: totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {m.commonNext()}
      </Button>
    </div>
  );
}
