export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatestitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Prompt templates" |
 *
 * @param {Prompttemplatestitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatestitle2: ((
  inputs?: Prompttemplatestitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatestitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatestitle2 as "promptTemplatesTitle" };
