export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusageemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No usage yet" |
 *
 * @param {Aiusageemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusageemptytitle3: ((
  inputs?: Aiusageemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusageemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusageemptytitle3 as "aiUsageEmptyTitle" };
