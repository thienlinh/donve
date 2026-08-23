export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignssepayautolabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Auto-reconcile via SePay" |
 *
 * @param {Campaignssepayautolabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignssepayautolabel3: ((
  inputs?: Campaignssepayautolabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignssepayautolabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignssepayautolabel3 as "campaignsSepayAutoLabel" };
