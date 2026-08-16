export type LocalizedString = import("../runtime.js").LocalizedString;
export type Forgotpasswordsent2Inputs = {};
/**
 * | output |
 * | --- |
 * | "If that email exists, a password reset link has been sent." |
 *
 * @param {Forgotpasswordsent2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const forgotpasswordsent2: ((
  inputs?: Forgotpasswordsent2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Forgotpasswordsent2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { forgotpasswordsent2 as "forgotPasswordSent" };
