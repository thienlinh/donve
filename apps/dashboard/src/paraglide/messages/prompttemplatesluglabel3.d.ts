export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesluglabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Prompttemplatesluglabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesluglabel3: ((
  inputs?: Prompttemplatesluglabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesluglabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesluglabel3 as "promptTemplateSlugLabel" };
