export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsordererrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't update this order. Try again." |
 *
 * @param {Leadsordererrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsordererrortoast3: ((
  inputs?: Leadsordererrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsordererrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsordererrortoast3 as "leadsOrderErrorToast" };
