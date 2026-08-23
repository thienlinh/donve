export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsnotifyznstemplateidlabel5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Template ID" |
 *
 * @param {Leadsnotifyznstemplateidlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsnotifyznstemplateidlabel5: ((
  inputs?: Leadsnotifyznstemplateidlabel5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsnotifyznstemplateidlabel5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsnotifyznstemplateidlabel5 as "leadsNotifyZnsTemplateIdLabel" };
