export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatetabtestbench4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Test bench" |
 *
 * @param {Prompttemplatetabtestbench4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatetabtestbench4: ((
  inputs?: Prompttemplatetabtestbench4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatetabtestbench4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatetabtestbench4 as "promptTemplateTabTestBench" };
