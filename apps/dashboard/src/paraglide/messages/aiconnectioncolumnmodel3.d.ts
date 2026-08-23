export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectioncolumnmodel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Default model" |
 *
 * @param {Aiconnectioncolumnmodel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectioncolumnmodel3: ((
  inputs?: Aiconnectioncolumnmodel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectioncolumnmodel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectioncolumnmodel3 as "aiConnectionColumnModel" };
