export const unmatchedTransactionKeys = {
  list: () => ["unmatched-transactions"] as const,
  orderDesk: (status = "all") => ["order-desk", status] as const,
  orderSearch: (query: string) =>
    ["unmatched-transactions", "order-search", query] as const
};
