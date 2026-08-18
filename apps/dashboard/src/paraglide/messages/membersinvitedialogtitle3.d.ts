export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitedialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Invite a member" |
 *
 * @param {Membersinvitedialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitedialogtitle3: ((
  inputs?: Membersinvitedialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitedialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitedialogtitle3 as "membersInviteDialogTitle" };
