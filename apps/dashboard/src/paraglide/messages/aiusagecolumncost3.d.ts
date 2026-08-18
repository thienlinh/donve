export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagecolumncost3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cost (credits)" |
 *
 * @param {Aiusagecolumncost3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagecolumncost3: ((
  inputs?: Aiusagecolumncost3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagecolumncost3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagecolumncost3 as "aiUsageColumnCost" };
