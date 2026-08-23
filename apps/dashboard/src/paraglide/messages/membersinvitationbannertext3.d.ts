export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitationbannertext3Inputs = {
  org: NonNullable<unknown>;
  role: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{org} invited you to join as {role}." |
 *
 * @param {Membersinvitationbannertext3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitationbannertext3: ((
  inputs: Membersinvitationbannertext3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitationbannertext3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitationbannertext3 as "membersInvitationBannerText" };
