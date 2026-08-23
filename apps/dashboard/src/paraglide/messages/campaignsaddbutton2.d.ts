export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsaddbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add campaign" |
 *
 * @param {Campaignsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsaddbutton2: ((
  inputs?: Campaignsaddbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsaddbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsaddbutton2 as "campaignsAddButton" };
