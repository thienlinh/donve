export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Structured prompts the AI compiles with your brand/product/tone variables before generating." |
 *
 * @param {Prompttemplatesdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesdescription2: ((
  inputs?: Prompttemplatesdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesdescription2 as "promptTemplatesDescription" };
