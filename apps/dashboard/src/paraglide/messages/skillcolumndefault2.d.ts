export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcolumndefault2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Default" |
 *
 * @param {Skillcolumndefault2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcolumndefault2: ((
  inputs?: Skillcolumndefault2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcolumndefault2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcolumndefault2 as "skillColumnDefault" };
