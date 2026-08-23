export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactionrename2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rename" |
 *
 * @param {Landingsactionrename2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactionrename2: ((
  inputs?: Landingsactionrename2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactionrename2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactionrename2 as "landingsActionRename" };
