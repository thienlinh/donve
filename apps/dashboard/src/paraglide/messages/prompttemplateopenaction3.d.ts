export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateopenaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Open" |
 *
 * @param {Prompttemplateopenaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateopenaction3: ((
  inputs?: Prompttemplateopenaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateopenaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateopenaction3 as "promptTemplateOpenAction" };
