import { studioComments } from "../schema/studio.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

export const studioCommentsRepository =
  createOrgScopedRepository(studioComments);
