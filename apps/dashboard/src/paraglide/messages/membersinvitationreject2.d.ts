export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitationreject2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Decline" |
 *
 * @param {Membersinvitationreject2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitationreject2: ((
  inputs?: Membersinvitationreject2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitationreject2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitationreject2 as "membersInvitationReject" };
