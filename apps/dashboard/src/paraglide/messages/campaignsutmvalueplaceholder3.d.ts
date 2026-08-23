export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsutmvalueplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Value" |
 *
 * @param {Campaignsutmvalueplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsutmvalueplaceholder3: ((
  inputs?: Campaignsutmvalueplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsutmvalueplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsutmvalueplaceholder3 as "campaignsUtmValuePlaceholder" };
