import { useState } from "react";

/**
 * Page-state + `{ page, pageSize }` query object shared by list pages that page a
 * `useQuery` through the `Pagination` component (`@/components/pagination`) — duplicated
 * verbatim across `campaigns-page.tsx` and `products-page.tsx` before this hook.
 */
export function usePagedQuery(pageSize: number): {
  page: number;
  setPage: (page: number) => void;
  query: { page: number; pageSize: number };
} {
  const [page, setPage] = useState(1);
  return { page, setPage, query: { page, pageSize } };
}

/** `data.total`/`data.pageSize` -> total page count for `<Pagination>`, defaulting to 1 while
 * `data` hasn't loaded yet. */
export function getTotalPages(
  data: { total: number; pageSize: number } | undefined
): number {
  return data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
}
