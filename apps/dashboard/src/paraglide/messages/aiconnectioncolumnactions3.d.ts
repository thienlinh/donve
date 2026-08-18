export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectioncolumnactions3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Aiconnectioncolumnactions3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectioncolumnactions3: ((
  inputs?: Aiconnectioncolumnactions3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectioncolumnactions3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectioncolumnactions3 as "aiConnectionColumnActions" };
