import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";

import * as m from "@/paraglide/messages.js";

/**
 * Shared loading/error/empty branches for a `useQuery`-backed list — matches the pattern
 * duplicated across `campaigns-page.tsx`, `domains-page.tsx`, `products-page.tsx`,
 * `leads-table.tsx`, `leads-kanban.tsx`. Renders nothing once data is ready (isPending, error
 * and isEmpty all false) so it can sit inline alongside the data-driven markup.
 */
export function QueryState({
  isPending,
  error,
  isEmpty,
  errorTitle,
  emptyTitle,
  loadingLabel = m.commonLoading(),
  className = "flex items-center gap-2 text-sm text-muted-foreground"
}: {
  isPending: boolean;
  error: Error | null;
  isEmpty: boolean;
  errorTitle: string;
  emptyTitle: string;
  loadingLabel?: string;
  className?: string;
}) {
  if (isPending) {
    return (
      <div className={className}>
        <Spinner /> {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{errorTitle}</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return null;
}
