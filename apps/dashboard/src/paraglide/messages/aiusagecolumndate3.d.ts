export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiusagecolumndate3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Date" |
 *
 * @param {Aiusagecolumndate3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiusagecolumndate3: ((
  inputs?: Aiusagecolumndate3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiusagecolumndate3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiusagecolumndate3 as "aiUsageColumnDate" };
