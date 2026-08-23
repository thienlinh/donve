export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectbutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect a key" |
 *
 * @param {Aiconnectbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectbutton2: ((
  inputs?: Aiconnectbutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectbutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectbutton2 as "aiConnectButton" };
