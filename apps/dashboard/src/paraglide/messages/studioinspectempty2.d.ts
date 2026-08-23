export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioinspectempty2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Select an element in Edit mode to inspect its style." |
 *
 * @param {Studioinspectempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioinspectempty2: ((
  inputs?: Studioinspectempty2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioinspectempty2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioinspectempty2 as "studioInspectEmpty" };
