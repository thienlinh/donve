export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatetabedit3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Prompttemplatetabedit3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatetabedit3: ((
  inputs?: Prompttemplatetabedit3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatetabedit3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatetabedit3 as "promptTemplateTabEdit" };
