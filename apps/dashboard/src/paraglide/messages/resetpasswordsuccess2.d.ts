export type LocalizedString = import("../runtime.js").LocalizedString;
export type Resetpasswordsuccess2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Password reset successfully. You can log in with your new password." |
 *
 * @param {Resetpasswordsuccess2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const resetpasswordsuccess2: ((
  inputs?: Resetpasswordsuccess2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Resetpasswordsuccess2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { resetpasswordsuccess2 as "resetPasswordSuccess" };
