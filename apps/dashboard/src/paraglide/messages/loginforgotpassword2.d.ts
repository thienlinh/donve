export type LocalizedString = import("../runtime.js").LocalizedString;
export type Loginforgotpassword2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Forgot password?" |
 *
 * @param {Loginforgotpassword2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginforgotpassword2: ((
  inputs?: Loginforgotpassword2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginforgotpassword2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { loginforgotpassword2 as "loginForgotPassword" };
