export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillpreviewlabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Preview" |
 *
 * @param {Skillpreviewlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillpreviewlabel2: ((
  inputs?: Skillpreviewlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillpreviewlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillpreviewlabel2 as "skillPreviewLabel" };
