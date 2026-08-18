export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingssortupdated2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Recently updated" |
 *
 * @param {Landingssortupdated2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingssortupdated2: ((
  inputs?: Landingssortupdated2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingssortupdated2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingssortupdated2 as "landingsSortUpdated" };
