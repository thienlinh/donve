export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsagehours2Inputs = {
  hours: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{hours}h" |
 *
 * @param {Leadsagehours2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsagehours2: ((
  inputs: Leadsagehours2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsagehours2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsagehours2 as "leadsAgeHours" };
