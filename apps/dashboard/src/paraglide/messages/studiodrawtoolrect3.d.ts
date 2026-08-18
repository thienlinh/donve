export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawtoolrect3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rectangle" |
 *
 * @param {Studiodrawtoolrect3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawtoolrect3: ((
  inputs?: Studiodrawtoolrect3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawtoolrect3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawtoolrect3 as "studioDrawToolRect" };
