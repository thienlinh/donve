export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsformfieldremovelabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove field" |
 *
 * @param {Campaignsformfieldremovelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsformfieldremovelabel4: ((
  inputs?: Campaignsformfieldremovelabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsformfieldremovelabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsformfieldremovelabel4 as "campaignsFormFieldRemoveLabel" };
