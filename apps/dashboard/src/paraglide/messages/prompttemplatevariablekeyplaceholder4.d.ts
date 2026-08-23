export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatevariablekeyplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "e.g. brand" |
 *
 * @param {Prompttemplatevariablekeyplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatevariablekeyplaceholder4: ((
  inputs?: Prompttemplatevariablekeyplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatevariablekeyplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatevariablekeyplaceholder4 as "promptTemplateVariableKeyPlaceholder" };
