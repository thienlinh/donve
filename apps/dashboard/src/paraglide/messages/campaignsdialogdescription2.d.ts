export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsdialogdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Attach products, set a date range, and configure payment." |
 *
 * @param {Campaignsdialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsdialogdescription2: ((
  inputs?: Campaignsdialogdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsdialogdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsdialogdescription2 as "campaignsDialogDescription" };
