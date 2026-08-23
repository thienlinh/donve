export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecreatedialogtitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create a prompt template" |
 *
 * @param {Prompttemplatecreatedialogtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecreatedialogtitle4: ((
  inputs?: Prompttemplatecreatedialogtitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecreatedialogtitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecreatedialogtitle4 as "promptTemplateCreateDialogTitle" };
