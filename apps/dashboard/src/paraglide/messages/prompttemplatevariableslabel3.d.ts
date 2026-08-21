export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatevariableslabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Variables" |
 *
 * @param {Prompttemplatevariableslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatevariableslabel3: ((
  inputs?: Prompttemplatevariableslabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatevariableslabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatevariableslabel3 as "promptTemplateVariablesLabel" };
