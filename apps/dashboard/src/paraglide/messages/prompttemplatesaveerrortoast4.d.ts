export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesaveerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this prompt template. Try again." |
 *
 * @param {Prompttemplatesaveerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesaveerrortoast4: ((
  inputs?: Prompttemplatesaveerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesaveerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesaveerrortoast4 as "promptTemplateSaveErrorToast" };
