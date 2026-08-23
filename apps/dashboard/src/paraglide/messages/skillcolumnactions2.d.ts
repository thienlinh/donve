export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcolumnactions2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Skillcolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcolumnactions2: ((
  inputs?: Skillcolumnactions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcolumnactions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcolumnactions2 as "skillColumnActions" };
