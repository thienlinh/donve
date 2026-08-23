export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsfiltersearchplaceholder3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name, phone, or email" |
 *
 * @param {Leadsfiltersearchplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsfiltersearchplaceholder3: ((
  inputs?: Leadsfiltersearchplaceholder3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsfiltersearchplaceholder3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsfiltersearchplaceholder3 as "leadsFilterSearchPlaceholder" };
