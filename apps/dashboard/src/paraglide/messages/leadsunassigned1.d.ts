export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsunassigned1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Unassigned" |
 *
 * @param {Leadsunassigned1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsunassigned1: ((
  inputs?: Leadsunassigned1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsunassigned1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsunassigned1 as "leadsUnassigned" };
