export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsactionduplicate2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Duplicate" |
 *
 * @param {Landingsactionduplicate2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsactionduplicate2: ((
  inputs?: Landingsactionduplicate2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsactionduplicate2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsactionduplicate2 as "landingsActionDuplicate" };
