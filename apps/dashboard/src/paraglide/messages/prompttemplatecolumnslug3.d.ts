export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecolumnslug3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Slug" |
 *
 * @param {Prompttemplatecolumnslug3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecolumnslug3: ((
  inputs?: Prompttemplatecolumnslug3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecolumnslug3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecolumnslug3 as "promptTemplateColumnSlug" };
