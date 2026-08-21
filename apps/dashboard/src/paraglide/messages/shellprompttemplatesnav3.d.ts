export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellprompttemplatesnav3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Prompt templates" |
 *
 * @param {Shellprompttemplatesnav3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellprompttemplatesnav3: ((
  inputs?: Shellprompttemplatesnav3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellprompttemplatesnav3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellprompttemplatesnav3 as "shellPromptTemplatesNav" };
