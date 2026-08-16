export type LocalizedString = import("../runtime.js").LocalizedString;
export type Resetpasswordtitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reset password" |
 *
 * @param {Resetpasswordtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const resetpasswordtitle2: ((
  inputs?: Resetpasswordtitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Resetpasswordtitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { resetpasswordtitle2 as "resetPasswordTitle" };
