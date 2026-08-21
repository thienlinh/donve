export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecolumntype3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Prompttemplatecolumntype3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecolumntype3: ((
  inputs?: Prompttemplatecolumntype3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecolumntype3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecolumntype3 as "promptTemplateColumnType" };
