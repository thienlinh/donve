import type { ProductListQuery } from "@dv/contracts";

export const productKeys = {
  list: () => ["products"] as const,
  listPage: (query: ProductListQuery) => ["products", "list", query] as const
};
