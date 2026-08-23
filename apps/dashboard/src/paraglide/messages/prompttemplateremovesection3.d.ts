export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremovesection3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove section" |
 *
 * @param {Prompttemplateremovesection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremovesection3: ((
  inputs?: Prompttemplateremovesection3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremovesection3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremovesection3 as "promptTemplateRemoveSection" };
