export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcolumnslug2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Skillcolumnslug2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcolumnslug2: ((
  inputs?: Skillcolumnslug2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcolumnslug2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcolumnslug2 as "skillColumnSlug" };
