export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsremoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Landing pages attached to this campaign will keep running, but won't show campaign stats anymore." |
 *
 * @param {Campaignsremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsremoveconfirmbody3: ((
  inputs?: Campaignsremoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsremoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsremoveconfirmbody3 as "campaignsRemoveConfirmBody" };
