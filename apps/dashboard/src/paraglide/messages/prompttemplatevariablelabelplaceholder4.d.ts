export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatevariablelabelplaceholder4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Display label" |
 *
 * @param {Prompttemplatevariablelabelplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatevariablelabelplaceholder4: ((
  inputs?: Prompttemplatevariablelabelplaceholder4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatevariablelabelplaceholder4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatevariablelabelplaceholder4 as "promptTemplateVariableLabelPlaceholder" };
