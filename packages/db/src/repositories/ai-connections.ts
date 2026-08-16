import { aiConnections } from "../schema/ai.js"
import { createOrgScopedRepository } from "./scoped-repository.js"

export const aiConnectionsRepository = createOrgScopedRepository(aiConnections)
