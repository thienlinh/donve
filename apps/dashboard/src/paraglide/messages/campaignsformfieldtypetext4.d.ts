export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsformfieldtypetext4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Text" |
 *
 * @param {Campaignsformfieldtypetext4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsformfieldtypetext4: ((
  inputs?: Campaignsformfieldtypetext4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsformfieldtypetext4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsformfieldtypetext4 as "campaignsFormFieldTypeText" };
