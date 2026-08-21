export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderfulfill2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Activate" |
 *
 * @param {Leadsorderfulfill2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderfulfill2: ((
  inputs?: Leadsorderfulfill2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderfulfill2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderfulfill2 as "leadsOrderFulfill" };
