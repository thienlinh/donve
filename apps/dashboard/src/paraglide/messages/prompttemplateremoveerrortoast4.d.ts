export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremoveerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this prompt template. Try again." |
 *
 * @param {Prompttemplateremoveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremoveerrortoast4: ((
  inputs?: Prompttemplateremoveerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremoveerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremoveerrortoast4 as "promptTemplateRemoveErrorToast" };
