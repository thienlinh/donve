export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiproviderlabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Provider" |
 *
 * @param {Aiproviderlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiproviderlabel2: ((
  inputs?: Aiproviderlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiproviderlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiproviderlabel2 as "aiProviderLabel" };
