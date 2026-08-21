export const unmatchedTransactionKeys = {
  list: () => ["unmatched-transactions"] as const,
  orderSearch: (query: string) =>
    ["unmatched-transactions", "order-search", query] as const
};
