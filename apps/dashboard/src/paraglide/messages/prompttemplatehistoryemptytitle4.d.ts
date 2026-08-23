export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatehistoryemptytitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "No test runs yet" |
 *
 * @param {Prompttemplatehistoryemptytitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatehistoryemptytitle4: ((
  inputs?: Prompttemplatehistoryemptytitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatehistoryemptytitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatehistoryemptytitle4 as "promptTemplateHistoryEmptyTitle" };
