export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatetabcompile3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Compile preview" |
 *
 * @param {Prompttemplatetabcompile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatetabcompile3: ((
  inputs?: Prompttemplatetabcompile3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatetabcompile3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatetabcompile3 as "promptTemplateTabCompile" };
