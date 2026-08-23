export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscancelinvitesuccesstoast4Inputs = {
  email: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Invitation to {email} cancelled" |
 *
 * @param {Memberscancelinvitesuccesstoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscancelinvitesuccesstoast4: ((
  inputs: Memberscancelinvitesuccesstoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscancelinvitesuccesstoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscancelinvitesuccesstoast4 as "membersCancelInviteSuccessToast" };
