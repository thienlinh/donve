export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusageloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load usage" |
 *
 * @param {Aiusageloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusageloaderrortitle4: ((
  inputs?: Aiusageloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusageloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusageloaderrortitle4 as "aiUsageLoadErrorTitle" };
