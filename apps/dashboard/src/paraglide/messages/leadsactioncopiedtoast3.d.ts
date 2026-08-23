export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactioncopiedtoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Phone number copied" |
 *
 * @param {Leadsactioncopiedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactioncopiedtoast3: ((
  inputs?: Leadsactioncopiedtoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactioncopiedtoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactioncopiedtoast3 as "leadsActionCopiedToast" };
