export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecompilebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Compile" |
 *
 * @param {Prompttemplatecompilebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecompilebutton3: ((
  inputs?: Prompttemplatecompilebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecompilebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecompilebutton3 as "promptTemplateCompileButton" };
