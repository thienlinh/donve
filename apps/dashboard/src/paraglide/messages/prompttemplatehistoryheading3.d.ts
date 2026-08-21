export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatehistoryheading3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Past runs" |
 *
 * @param {Prompttemplatehistoryheading3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatehistoryheading3: ((
  inputs?: Prompttemplatehistoryheading3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatehistoryheading3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatehistoryheading3 as "promptTemplateHistoryHeading" };
