export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsimportnamelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name (optional)" |
 *
 * @param {Landingsimportnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsimportnamelabel3: ((
  inputs?: Landingsimportnamelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsimportnamelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsimportnamelabel3 as "landingsImportNameLabel" };
