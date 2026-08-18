export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagecolumnmodel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Model" |
 *
 * @param {Aiusagecolumnmodel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagecolumnmodel3: ((
  inputs?: Aiusagecolumnmodel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagecolumnmodel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagecolumnmodel3 as "aiUsageColumnModel" };
