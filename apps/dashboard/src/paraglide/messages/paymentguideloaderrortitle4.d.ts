export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentguideloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load the guide" |
 *
 * @param {Paymentguideloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentguideloaderrortitle4: ((
  inputs?: Paymentguideloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentguideloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentguideloaderrortitle4 as "paymentGuideLoadErrorTitle" };
