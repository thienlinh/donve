export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesectionslabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sections" |
 *
 * @param {Prompttemplatesectionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesectionslabel3: ((
  inputs?: Prompttemplatesectionslabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesectionslabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesectionslabel3 as "promptTemplateSectionsLabel" };
