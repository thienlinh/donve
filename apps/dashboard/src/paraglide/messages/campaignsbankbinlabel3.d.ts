export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsbankbinlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Campaignsbankbinlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsbankbinlabel3: ((
  inputs?: Campaignsbankbinlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsbankbinlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsbankbinlabel3 as "campaignsBankBinLabel" };
