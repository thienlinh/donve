export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsformfieldtypeselect4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Dropdown" |
 *
 * @param {Campaignsformfieldtypeselect4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsformfieldtypeselect4: ((
  inputs?: Campaignsformfieldtypeselect4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsformfieldtypeselect4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsformfieldtypeselect4 as "campaignsFormFieldTypeSelect" };
