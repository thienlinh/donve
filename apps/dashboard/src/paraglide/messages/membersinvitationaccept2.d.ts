export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitationaccept2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Accept" |
 *
 * @param {Membersinvitationaccept2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitationaccept2: ((
  inputs?: Membersinvitationaccept2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitationaccept2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitationaccept2 as "membersInvitationAccept" };
