export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsdescription1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Track, filter, and work every lead your campaigns bring in." |
 *
 * @param {Leadsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsdescription1: ((
  inputs?: Leadsdescription1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsdescription1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsdescription1 as "leadsDescription" };
