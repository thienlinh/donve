export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatenotfoundtitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Prompt template not found" |
 *
 * @param {Prompttemplatenotfoundtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatenotfoundtitle4: ((
  inputs?: Prompttemplatenotfoundtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatenotfoundtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatenotfoundtitle4 as "promptTemplateNotFoundTitle" };
