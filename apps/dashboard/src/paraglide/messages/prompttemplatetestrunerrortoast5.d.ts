export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatetestrunerrortoast5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Test run failed. Try again." |
 *
 * @param {Prompttemplatetestrunerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatetestrunerrortoast5: ((
  inputs?: Prompttemplatetestrunerrortoast5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatetestrunerrortoast5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatetestrunerrortoast5 as "promptTemplateTestRunErrorToast" };
