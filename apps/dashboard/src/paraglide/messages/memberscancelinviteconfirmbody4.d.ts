export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscancelinviteconfirmbody4Inputs = {};
/**
 * | output |
 * | --- |
 * | "They won't be able to accept this invitation anymore." |
 *
 * @param {Memberscancelinviteconfirmbody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscancelinviteconfirmbody4: ((
  inputs?: Memberscancelinviteconfirmbody4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscancelinviteconfirmbody4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscancelinviteconfirmbody4 as "membersCancelInviteConfirmBody" };
