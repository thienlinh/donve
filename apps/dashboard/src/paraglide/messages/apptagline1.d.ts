export type LocalizedString = import("../runtime.js").LocalizedString;
export type Apptagline1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect orders, ship with ease" |
 *
 * @param {Apptagline1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const apptagline1: ((
  inputs?: Apptagline1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Apptagline1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { apptagline1 as "appTagline" };
