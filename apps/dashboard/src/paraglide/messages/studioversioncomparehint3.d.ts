export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversioncomparehint3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Select exactly 2 versions to compare" |
 *
 * @param {Studioversioncomparehint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversioncomparehint3: ((
  inputs?: Studioversioncomparehint3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversioncomparehint3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversioncomparehint3 as "studioVersionCompareHint" };
