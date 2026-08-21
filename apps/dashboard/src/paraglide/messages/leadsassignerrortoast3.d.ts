export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsassignerrortoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't assign this lead. Try again." |
 *
 * @param {Leadsassignerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsassignerrortoast3: ((
  inputs?: Leadsassignerrortoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsassignerrortoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsassignerrortoast3 as "leadsAssignErrorToast" };
