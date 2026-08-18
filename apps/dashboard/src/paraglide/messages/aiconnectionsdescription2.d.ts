export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectionsdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect your own API key to generate with your models, or use platform credits." |
 *
 * @param {Aiconnectionsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectionsdescription2: ((
  inputs?: Aiconnectionsdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectionsdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectionsdescription2 as "aiConnectionsDescription" };
