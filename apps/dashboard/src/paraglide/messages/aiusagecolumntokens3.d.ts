export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagecolumntokens3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Tokens" |
 *
 * @param {Aiusagecolumntokens3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagecolumntokens3: ((
  inputs?: Aiusagecolumntokens3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagecolumntokens3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagecolumntokens3 as "aiUsageColumnTokens" };
