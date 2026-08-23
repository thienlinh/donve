export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfilterrepeatcustomerlabel4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Repeat customers only" |
 *
 * @param {Leadsfilterrepeatcustomerlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfilterrepeatcustomerlabel4: ((
  inputs?: Leadsfilterrepeatcustomerlabel4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfilterrepeatcustomerlabel4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfilterrepeatcustomerlabel4 as "leadsFilterRepeatCustomerLabel" };
