export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignscolumnstatus2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Status" |
 *
 * @param {Campaignscolumnstatus2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignscolumnstatus2: ((
  inputs?: Campaignscolumnstatus2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignscolumnstatus2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignscolumnstatus2 as "campaignsColumnStatus" };
