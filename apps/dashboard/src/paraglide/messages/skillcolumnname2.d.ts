export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcolumnname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Skillcolumnname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcolumnname2: ((
  inputs?: Skillcolumnname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcolumnname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcolumnname2 as "skillColumnName" };
