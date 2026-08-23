export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatehistoryemptybody4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Run the template above to see its output and Lighthouse score here." |
 *
 * @param {Prompttemplatehistoryemptybody4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatehistoryemptybody4: ((
  inputs?: Prompttemplatehistoryemptybody4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatehistoryemptybody4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatehistoryemptybody4 as "promptTemplateHistoryEmptyBody" };
