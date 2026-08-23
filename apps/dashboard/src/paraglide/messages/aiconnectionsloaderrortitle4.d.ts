export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectionsloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load AI connections" |
 *
 * @param {Aiconnectionsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectionsloaderrortitle4: ((
  inputs?: Aiconnectionsloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectionsloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectionsloaderrortitle4 as "aiConnectionsLoadErrorTitle" };
