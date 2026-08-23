export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecompareheading3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Comparing 2 runs" |
 *
 * @param {Prompttemplatecompareheading3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecompareheading3: ((
  inputs?: Prompttemplatecompareheading3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecompareheading3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecompareheading3 as "promptTemplateCompareHeading" };
