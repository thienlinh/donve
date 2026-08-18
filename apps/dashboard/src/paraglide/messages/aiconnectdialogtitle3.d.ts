export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectdialogtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect an API key" |
 *
 * @param {Aiconnectdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectdialogtitle3: ((
  inputs?: Aiconnectdialogtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectdialogtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectdialogtitle3 as "aiConnectDialogTitle" };
