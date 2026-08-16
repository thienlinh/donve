import { paymentConnections } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const paymentConnectionsRepository =
  createOrgScopedRepository(paymentConnections);
