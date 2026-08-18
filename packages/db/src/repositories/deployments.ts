import { deployments } from "../schema/publishing.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const deploymentsRepository = createOrgScopedRepository(deployments);
