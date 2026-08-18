import { chatMessages } from "../schema/studio.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const chatMessagesRepository = createOrgScopedRepository(chatMessages);
