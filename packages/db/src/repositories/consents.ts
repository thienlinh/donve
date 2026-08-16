import { consents } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const consentsRepository = createOrgScopedRepository(consents);
