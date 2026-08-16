export type { AuthConfig } from "./config.js";
export { createAuth } from "./config.js";
export type { CreateInviteEmailOptions } from "./invites.js";
export { acceptInvite, createInvite } from "./invites.js";
export type { Permission } from "./permissions.js";
export {
  accessControl,
  adminRole,
  can,
  editorRole,
  ownerRole,
  PERMISSIONS,
  salesRole,
} from "./permissions.js";
