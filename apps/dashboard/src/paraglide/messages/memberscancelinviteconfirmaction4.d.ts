export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscancelinviteconfirmaction4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel invitation" |
 *
 * @param {Memberscancelinviteconfirmaction4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscancelinviteconfirmaction4: ((
  inputs?: Memberscancelinviteconfirmaction4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscancelinviteconfirmaction4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscancelinviteconfirmaction4 as "membersCancelInviteConfirmAction" };
