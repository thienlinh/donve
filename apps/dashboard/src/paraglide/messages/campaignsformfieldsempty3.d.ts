export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsformfieldsempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Default lead-capture fields apply — add a custom field if you need more." |
 *
 * @param {Campaignsformfieldsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsformfieldsempty3: ((
  inputs?: Campaignsformfieldsempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsformfieldsempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsformfieldsempty3 as "campaignsFormFieldsEmpty" };
