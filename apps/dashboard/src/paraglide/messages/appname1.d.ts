export type LocalizedString = import("../runtime.js").LocalizedString;
export type Appname1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Donve" |
 *
 * @param {Appname1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const appname1: ((
  inputs?: Appname1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Appname1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { appname1 as "appName" };
