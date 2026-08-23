export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitedialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "They'll see this invitation the next time they sign in with this email." |
 *
 * @param {Membersinvitedialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitedialogdescription3: ((
  inputs?: Membersinvitedialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitedialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitedialogdescription3 as "membersInviteDialogDescription" };
