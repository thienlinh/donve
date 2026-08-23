export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactionviewlive3Inputs = {};
/**
 * | output |
 * | --- |
 * | "View live" |
 *
 * @param {Landingsactionviewlive3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactionviewlive3: ((
  inputs?: Landingsactionviewlive3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactionviewlive3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactionviewlive3 as "landingsActionViewLive" };
