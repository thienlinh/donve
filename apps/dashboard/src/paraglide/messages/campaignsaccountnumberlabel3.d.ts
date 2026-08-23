export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsaccountnumberlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Account number" |
 *
 * @param {Campaignsaccountnumberlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsaccountnumberlabel3: ((
  inputs?: Campaignsaccountnumberlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsaccountnumberlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsaccountnumberlabel3 as "campaignsAccountNumberLabel" };
