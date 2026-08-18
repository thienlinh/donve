export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawtoolpen3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pen" |
 *
 * @param {Studiodrawtoolpen3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawtoolpen3: ((
  inputs?: Studiodrawtoolpen3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawtoolpen3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawtoolpen3 as "studioDrawToolPen" };
