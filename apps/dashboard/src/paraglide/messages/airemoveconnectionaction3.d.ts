export type LocalizedString = import("../runtime.js").LocalizedString;
export type Airemoveconnectionaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove connection" |
 *
 * @param {Airemoveconnectionaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const airemoveconnectionaction3: ((
  inputs?: Airemoveconnectionaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Airemoveconnectionaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { airemoveconnectionaction3 as "aiRemoveConnectionAction" };
