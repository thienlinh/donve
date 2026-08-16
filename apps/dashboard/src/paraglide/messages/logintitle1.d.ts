export type LocalizedString = import("../runtime.js").LocalizedString;
export type Logintitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Logintitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const logintitle1: ((
  inputs?: Logintitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Logintitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { logintitle1 as "loginTitle" };
