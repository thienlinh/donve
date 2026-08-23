export type LocalizedString = import("../runtime.js").LocalizedString;
export type Verifyemailbody2Inputs = {};
/**
 * | output |
 * | --- |
 * | "We sent a verification link to the email you just signed up with. Click it to activate your account." |
 *
 * @param {Verifyemailbody2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const verifyemailbody2: ((
  inputs?: Verifyemailbody2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Verifyemailbody2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { verifyemailbody2 as "verifyEmailBody" };
