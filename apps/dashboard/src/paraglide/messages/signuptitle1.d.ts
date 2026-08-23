export type LocalizedString = import("../runtime.js").LocalizedString;
export type Signuptitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create an account" |
 *
 * @param {Signuptitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const signuptitle1: ((
  inputs?: Signuptitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Signuptitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { signuptitle1 as "signupTitle" };
