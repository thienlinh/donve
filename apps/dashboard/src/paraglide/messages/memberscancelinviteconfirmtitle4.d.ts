export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscancelinviteconfirmtitle4Inputs = {
  email: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Cancel invitation to {email}?" |
 *
 * @param {Memberscancelinviteconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscancelinviteconfirmtitle4: ((
  inputs: Memberscancelinviteconfirmtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscancelinviteconfirmtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscancelinviteconfirmtitle4 as "membersCancelInviteConfirmTitle" };
