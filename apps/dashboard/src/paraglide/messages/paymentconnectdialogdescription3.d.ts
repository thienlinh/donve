export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectdialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Paste the bank details and webhook API key from your own SePay account — see the guide below if you haven't created one yet." |
 *
 * @param {Paymentconnectdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectdialogdescription3: ((
  inputs?: Paymentconnectdialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectdialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectdialogdescription3 as "paymentConnectDialogDescription" };
