export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplatesemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No prompt templates yet" |
 *
 * @param {Prompttemplatesemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplatesemptytitle3: ((
  inputs?: Prompttemplatesemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplatesemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplatesemptytitle3 as "promptTemplatesEmptyTitle" };
