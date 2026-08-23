export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsrepeatcustomerbadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Repeat customer" |
 *
 * @param {Leadsrepeatcustomerbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsrepeatcustomerbadge3: ((
  inputs?: Leadsrepeatcustomerbadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsrepeatcustomerbadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsrepeatcustomerbadge3 as "leadsRepeatCustomerBadge" };
