import { unmatchedTransactions } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const unmatchedTransactionsRepository = createOrgScopedRepository(
  unmatchedTransactions
);
