export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aicreditbalancelowwarning4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Credit balance is running low — top up to avoid interrupted generations." |
 *
 * @param {Aicreditbalancelowwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aicreditbalancelowwarning4: ((
  inputs?: Aicreditbalancelowwarning4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aicreditbalancelowwarning4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aicreditbalancelowwarning4 as "aiCreditBalanceLowWarning" };
