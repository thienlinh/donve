export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectionsloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load payment connections" |
 *
 * @param {Paymentconnectionsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectionsloaderrortitle4: ((
  inputs?: Paymentconnectionsloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectionsloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectionsloaderrortitle4 as "paymentConnectionsLoadErrorTitle" };
