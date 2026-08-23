export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsagedays2Inputs = {
  days: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{days}d" |
 *
 * @param {Leadsagedays2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsagedays2: ((
  inputs: Leadsagedays2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsagedays2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsagedays2 as "leadsAgeDays" };
