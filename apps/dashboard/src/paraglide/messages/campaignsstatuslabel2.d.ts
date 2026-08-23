export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstatuslabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Campaignsstatuslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstatuslabel2: ((
  inputs?: Campaignsstatuslabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstatuslabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstatuslabel2 as "campaignsStatusLabel" };
