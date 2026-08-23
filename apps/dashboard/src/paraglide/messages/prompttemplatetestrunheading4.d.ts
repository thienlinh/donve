export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatetestrunheading4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Run a test" |
 *
 * @param {Prompttemplatetestrunheading4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatetestrunheading4: ((
  inputs?: Prompttemplatetestrunheading4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatetestrunheading4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatetestrunheading4 as "promptTemplateTestRunHeading" };
