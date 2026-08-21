export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersinvitesuccesstoast3Inputs = {
  email: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Invite sent to {email}" |
 *
 * @param {Membersinvitesuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersinvitesuccesstoast3: ((
  inputs: Membersinvitesuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersinvitesuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersinvitesuccesstoast3 as "membersInviteSuccessToast" };
