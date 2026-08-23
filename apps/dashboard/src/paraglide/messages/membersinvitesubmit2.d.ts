export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitesubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Send invite" |
 *
 * @param {Membersinvitesubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitesubmit2: ((
  inputs?: Membersinvitesubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitesubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitesubmit2 as "membersInviteSubmit" };
