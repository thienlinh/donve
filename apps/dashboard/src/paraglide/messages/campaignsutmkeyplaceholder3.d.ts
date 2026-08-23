export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsutmkeyplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Parameter (e.g. utm_source)" |
 *
 * @param {Campaignsutmkeyplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsutmkeyplaceholder3: ((
  inputs?: Campaignsutmkeyplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsutmkeyplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsutmkeyplaceholder3 as "campaignsUtmKeyPlaceholder" };
