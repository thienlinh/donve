import { chatSessions } from "../schema/studio.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const chatSessionsRepository = createOrgScopedRepository(chatSessions);
