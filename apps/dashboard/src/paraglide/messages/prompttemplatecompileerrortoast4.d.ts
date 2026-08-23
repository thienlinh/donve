export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecompileerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't compile this template. Check the required variables." |
 *
 * @param {Prompttemplatecompileerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecompileerrortoast4: ((
  inputs?: Prompttemplatecompileerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecompileerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecompileerrortoast4 as "promptTemplateCompileErrorToast" };
