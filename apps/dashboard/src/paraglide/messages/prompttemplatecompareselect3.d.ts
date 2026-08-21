export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecompareselect3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Compare" |
 *
 * @param {Prompttemplatecompareselect3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecompareselect3: ((
  inputs?: Prompttemplatecompareselect3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecompareselect3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecompareselect3 as "promptTemplateCompareSelect" };
