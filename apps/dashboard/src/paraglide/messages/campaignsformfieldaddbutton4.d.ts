export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsformfieldaddbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add field" |
 *
 * @param {Campaignsformfieldaddbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsformfieldaddbutton4: ((
  inputs?: Campaignsformfieldaddbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsformfieldaddbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsformfieldaddbutton4 as "campaignsFormFieldAddButton" };
