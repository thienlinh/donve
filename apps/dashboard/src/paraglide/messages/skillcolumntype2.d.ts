export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcolumntype2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Skillcolumntype2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcolumntype2: ((
  inputs?: Skillcolumntype2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcolumntype2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcolumntype2 as "skillColumnType" };
