export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonprevious1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Previous" |
 *
 * @param {Commonprevious1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonprevious1: ((
  inputs?: Commonprevious1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonprevious1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonprevious1 as "commonPrevious" };
