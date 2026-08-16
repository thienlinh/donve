import { refundRequests } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const refundRequestsRepository =
  createOrgScopedRepository(refundRequests);
