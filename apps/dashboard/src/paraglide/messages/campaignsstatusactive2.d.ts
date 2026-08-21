export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsstatusactive2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Active" |
 *
 * @param {Campaignsstatusactive2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsstatusactive2: ((
  inputs?: Campaignsstatusactive2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsstatusactive2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsstatusactive2 as "campaignsStatusActive" };
