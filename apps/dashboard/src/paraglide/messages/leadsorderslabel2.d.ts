export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsorderslabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Leadsorderslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsorderslabel2: ((
  inputs?: Leadsorderslabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsorderslabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsorderslabel2 as "leadsOrdersLabel" };
