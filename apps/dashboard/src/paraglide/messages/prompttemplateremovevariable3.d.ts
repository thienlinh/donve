export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateremovevariable3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove variable" |
 *
 * @param {Prompttemplateremovevariable3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateremovevariable3: ((
  inputs?: Prompttemplateremovevariable3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateremovevariable3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateremovevariable3 as "promptTemplateRemoveVariable" };
