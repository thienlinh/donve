export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitationresponderrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't respond to the invitation. Try again." |
 *
 * @param {Membersinvitationresponderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitationresponderrortoast4: ((
  inputs?: Membersinvitationresponderrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitationresponderrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitationresponderrortoast4 as "membersInvitationRespondErrorToast" };
