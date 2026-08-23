export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatecreatedialogdescription4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Start with a slug — sections and variables are edited from the template's own page." |
 *
 * @param {Prompttemplatecreatedialogdescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatecreatedialogdescription4: ((
  inputs?: Prompttemplatecreatedialogdescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatecreatedialogdescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatecreatedialogdescription4 as "promptTemplateCreateDialogDescription" };
