export type LocalizedString = import("../runtime.js").LocalizedString;
export type Airemoveconnectionerrortoast4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't remove this connection. Try again." |
 *
 * @param {Airemoveconnectionerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const airemoveconnectionerrortoast4: ((
  inputs?: Airemoveconnectionerrortoast4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Airemoveconnectionerrortoast4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { airemoveconnectionerrortoast4 as "aiRemoveConnectionErrorToast" };
