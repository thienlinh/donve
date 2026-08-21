export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcontentlabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Content (Markdown)" |
 *
 * @param {Skillcontentlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcontentlabel2: ((
  inputs?: Skillcontentlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcontentlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcontentlabel2 as "skillContentLabel" };
