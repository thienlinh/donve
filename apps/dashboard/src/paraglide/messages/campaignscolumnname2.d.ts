export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignscolumnname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Campaignscolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignscolumnname2: ((
  inputs?: Campaignscolumnname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignscolumnname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignscolumnname2 as "campaignsColumnName" };
