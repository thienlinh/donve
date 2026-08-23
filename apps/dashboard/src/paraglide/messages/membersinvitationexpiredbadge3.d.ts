export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitationexpiredbadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Expired" |
 *
 * @param {Membersinvitationexpiredbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitationexpiredbadge3: ((
  inputs?: Membersinvitationexpiredbadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitationexpiredbadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitationexpiredbadge3 as "membersInvitationExpiredBadge" };
