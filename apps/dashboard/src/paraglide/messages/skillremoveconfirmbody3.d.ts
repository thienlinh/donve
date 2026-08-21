export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Landing pages using it by default will no longer apply it." |
 *
 * @param {Skillremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillremoveconfirmbody3: ((
  inputs?: Skillremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillremoveconfirmbody3 as "skillRemoveConfirmBody" };
