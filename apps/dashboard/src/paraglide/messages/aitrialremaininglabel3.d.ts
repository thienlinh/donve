export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aitrialremaininglabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Free trial uses left" |
 *
 * @param {Aitrialremaininglabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aitrialremaininglabel3: ((
  inputs?: Aitrialremaininglabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aitrialremaininglabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aitrialremaininglabel3 as "aiTrialRemainingLabel" };
