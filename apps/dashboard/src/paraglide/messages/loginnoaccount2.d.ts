export type LocalizedString = import("../runtime.js").LocalizedString;
export type Loginnoaccount2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Don't have an account?" |
 *
 * @param {Loginnoaccount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const loginnoaccount2: ((
  inputs?: Loginnoaccount2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Loginnoaccount2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { loginnoaccount2 as "loginNoAccount" };
