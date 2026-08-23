export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aitrialremaininglowwarning4Inputs = {};
/**
 * | output |
 * | --- |
 * | "You're almost out of free trial uses — connect your own API key to keep generating." |
 *
 * @param {Aitrialremaininglowwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aitrialremaininglowwarning4: ((
  inputs?: Aitrialremaininglowwarning4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aitrialremaininglowwarning4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aitrialremaininglowwarning4 as "aiTrialRemainingLowWarning" };
