export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsutmdefaultsempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No default UTM parameters — links without their own UTM tags won't be tagged." |
 *
 * @param {Campaignsutmdefaultsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsutmdefaultsempty3: ((
  inputs?: Campaignsutmdefaultsempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsutmdefaultsempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsutmdefaultsempty3 as "campaignsUtmDefaultsEmpty" };
