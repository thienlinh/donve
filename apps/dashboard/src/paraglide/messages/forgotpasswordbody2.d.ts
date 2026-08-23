export type LocalizedString = import("../runtime.js").LocalizedString;
export type Forgotpasswordbody2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Enter your email and we'll send you a password reset link." |
 *
 * @param {Forgotpasswordbody2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const forgotpasswordbody2: ((
  inputs?: Forgotpasswordbody2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Forgotpasswordbody2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { forgotpasswordbody2 as "forgotPasswordBody" };
