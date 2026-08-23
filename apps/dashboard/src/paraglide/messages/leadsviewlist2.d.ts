export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsviewlist2Inputs = {};
/**
 * | output |
 * | --- |
 * | "List" |
 *
 * @param {Leadsviewlist2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsviewlist2: ((
  inputs?: Leadsviewlist2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsviewlist2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsviewlist2 as "leadsViewList" };
