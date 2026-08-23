export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactiondelete2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Landingsactiondelete2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactiondelete2: ((
  inputs?: Landingsactiondelete2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactiondelete2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactiondelete2 as "landingsActionDelete" };
