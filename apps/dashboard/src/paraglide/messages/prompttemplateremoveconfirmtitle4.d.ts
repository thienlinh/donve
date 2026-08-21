export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremoveconfirmtitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove this prompt template?" |
 *
 * @param {Prompttemplateremoveconfirmtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremoveconfirmtitle4: ((
  inputs?: Prompttemplateremoveconfirmtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremoveconfirmtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremoveconfirmtitle4 as "promptTemplateRemoveConfirmTitle" };
