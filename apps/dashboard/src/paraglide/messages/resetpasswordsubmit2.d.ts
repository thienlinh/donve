export type LocalizedString = import("../runtime.js").LocalizedString;
export type Resetpasswordsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Reset password" |
 *
 * @param {Resetpasswordsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const resetpasswordsubmit2: ((
  inputs?: Resetpasswordsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Resetpasswordsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { resetpasswordsubmit2 as "resetPasswordSubmit" };
