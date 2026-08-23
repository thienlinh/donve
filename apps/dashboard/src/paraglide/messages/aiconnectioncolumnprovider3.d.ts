export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectioncolumnprovider3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Provider" |
 *
 * @param {Aiconnectioncolumnprovider3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectioncolumnprovider3: ((
  inputs?: Aiconnectioncolumnprovider3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectioncolumnprovider3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectioncolumnprovider3 as "aiConnectionColumnProvider" };
