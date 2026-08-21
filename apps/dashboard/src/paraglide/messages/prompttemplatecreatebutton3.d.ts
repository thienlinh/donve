export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecreatebutton3Inputs = {};
/**
 * | output |
 * | --- |
 * | "New template" |
 *
 * @param {Prompttemplatecreatebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecreatebutton3: ((
  inputs?: Prompttemplatecreatebutton3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecreatebutton3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecreatebutton3 as "promptTemplateCreateButton" };
