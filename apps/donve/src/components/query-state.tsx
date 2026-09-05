import { Button } from "@dv/ui/components/shadcn/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import type { ReactNode } from "react";

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
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRetry,
  loadingLabel = m.commonLoading(),
  className = "flex items-center gap-2 text-sm text-muted-foreground"
}: {
  isPending: boolean;
  error: Error | null;
  isEmpty: boolean;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  onRetry?: () => void | Promise<void>;
  loadingLabel?: string;
  className?: string;
}) {
  if (isPending) {
    return (
      <div aria-busy="true" className={className}>
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
        {onRetry && (
          <Button
            onClick={() => {
              void onRetry();
            }}
            variant="outline"
          >
            {m.commonRetry()}
          </Button>
        )}
      </Empty>
    );
  }

  if (isEmpty) {
    return (
      <Empty>
        <EmptyHeader>
          {emptyIcon && <EmptyMedia variant="icon">{emptyIcon}</EmptyMedia>}
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          {emptyDescription && (
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          )}
        </EmptyHeader>
        {emptyAction}
      </Empty>
    );
  }

  return null;
}
