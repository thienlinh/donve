export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiapikeylabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "API key" |
 *
 * @param {Aiapikeylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiapikeylabel3: ((
  inputs?: Aiapikeylabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiapikeylabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiapikeylabel3 as "aiApiKeyLabel" };
