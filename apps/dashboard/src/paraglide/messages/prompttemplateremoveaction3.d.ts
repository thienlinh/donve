export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremoveaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove template" |
 *
 * @param {Prompttemplateremoveaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremoveaction3: ((
  inputs?: Prompttemplateremoveaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremoveaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremoveaction3 as "promptTemplateRemoveAction" };
