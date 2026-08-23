export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterproductlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Product" |
 *
 * @param {Leadsfilterproductlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterproductlabel3: ((
  inputs?: Leadsfilterproductlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterproductlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterproductlabel3 as "leadsFilterProductLabel" };
