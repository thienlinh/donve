export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitebutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Invite member" |
 *
 * @param {Membersinvitebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitebutton2: ((
  inputs?: Membersinvitebutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitebutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitebutton2 as "membersInviteButton" };
