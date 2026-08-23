export type LocalizedString = import("../runtime.js").LocalizedString;
export type Settingstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Settings" |
 *
 * @param {Settingstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const settingstitle1: ((
  inputs?: Settingstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Settingstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { settingstitle1 as "settingsTitle" };
