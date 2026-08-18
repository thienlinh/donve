export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectsubmit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect" |
 *
 * @param {Aiconnectsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectsubmit2: ((
  inputs?: Aiconnectsubmit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectsubmit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectsubmit2 as "aiConnectSubmit" };
