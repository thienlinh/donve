export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagedescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Platform credits and recent generations for this organization." |
 *
 * @param {Aiusagedescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagedescription2: ((
  inputs?: Aiusagedescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagedescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagedescription2 as "aiUsageDescription" };
