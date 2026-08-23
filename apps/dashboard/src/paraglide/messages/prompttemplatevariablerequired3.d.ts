export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatevariablerequired3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Required" |
 *
 * @param {Prompttemplatevariablerequired3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatevariablerequired3: ((
  inputs?: Prompttemplatevariablerequired3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatevariablerequired3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatevariablerequired3 as "promptTemplateVariableRequired" };
