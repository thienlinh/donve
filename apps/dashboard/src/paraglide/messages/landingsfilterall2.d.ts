export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsfilterall2Inputs = {};
/**
 * | output |
 * | --- |
 * | "All" |
 *
 * @param {Landingsfilterall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsfilterall2: ((
  inputs?: Landingsfilterall2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsfilterall2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsfilterall2 as "landingsFilterAll" };
