export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsordercountlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Leadsordercountlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsordercountlabel3: ((
  inputs?: Leadsordercountlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsordercountlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsordercountlabel3 as "leadsOrderCountLabel" };
