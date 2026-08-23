export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectionstitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "AI connections" |
 *
 * @param {Aiconnectionstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectionstitle2: ((
  inputs?: Aiconnectionstitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectionstitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectionstitle2 as "aiConnectionsTitle" };
