export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdsrindicatorlabel3Inputs = {
  count: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{count} data-subject request(s) overdue or due soon" |
 *
 * @param {Leadsdsrindicatorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdsrindicatorlabel3: ((
  inputs: Leadsdsrindicatorlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdsrindicatorlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdsrindicatorlabel3 as "leadsDsrIndicatorLabel" };
