export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsemptytitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "No leads match these filters" |
 *
 * @param {Leadsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsemptytitle2: ((
  inputs?: Leadsemptytitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsemptytitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsemptytitle2 as "leadsEmptyTitle" };
