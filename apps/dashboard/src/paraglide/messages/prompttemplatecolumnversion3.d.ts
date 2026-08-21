export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecolumnversion3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Version" |
 *
 * @param {Prompttemplatecolumnversion3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecolumnversion3: ((
  inputs?: Prompttemplatecolumnversion3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecolumnversion3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecolumnversion3 as "promptTemplateColumnVersion" };
