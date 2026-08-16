import { landingPages } from "../schema/studio.js"
import { createOrgScopedRepository } from "./scoped-repository.js"

export const landingPagesRepository = createOrgScopedRepository(landingPages)
