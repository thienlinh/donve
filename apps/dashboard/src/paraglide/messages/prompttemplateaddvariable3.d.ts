export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateaddvariable3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Add variable" |
 *
 * @param {Prompttemplateaddvariable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateaddvariable3: ((
  inputs?: Prompttemplateaddvariable3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateaddvariable3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateaddvariable3 as "promptTemplateAddVariable" };
