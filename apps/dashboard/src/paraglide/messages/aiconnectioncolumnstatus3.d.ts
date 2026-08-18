export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectioncolumnstatus3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Aiconnectioncolumnstatus3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectioncolumnstatus3: ((
  inputs?: Aiconnectioncolumnstatus3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectioncolumnstatus3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectioncolumnstatus3 as "aiConnectionColumnStatus" };
