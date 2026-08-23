export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "They'll immediately lose access to this organization." |
 *
 * @param {Membersremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersremoveconfirmbody3: ((
  inputs?: Membersremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersremoveconfirmbody3 as "membersRemoveConfirmBody" };
