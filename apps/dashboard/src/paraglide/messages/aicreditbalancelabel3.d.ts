export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aicreditbalancelabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Credit balance" |
 *
 * @param {Aicreditbalancelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aicreditbalancelabel3: ((
  inputs?: Aicreditbalancelabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aicreditbalancelabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aicreditbalancelabel3 as "aiCreditBalanceLabel" };
