export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiogenerateerrorconnectaibutton5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Connect AI" |
 *
 * @param {Studiogenerateerrorconnectaibutton5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiogenerateerrorconnectaibutton5: ((
  inputs?: Studiogenerateerrorconnectaibutton5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiogenerateerrorconnectaibutton5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiogenerateerrorconnectaibutton5 as "studioGenerateErrorConnectAiButton" };
