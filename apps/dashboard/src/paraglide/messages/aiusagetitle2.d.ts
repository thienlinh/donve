export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagetitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Usage" |
 *
 * @param {Aiusagetitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagetitle2: ((
  inputs?: Aiusagetitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagetitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagetitle2 as "aiUsageTitle" };
