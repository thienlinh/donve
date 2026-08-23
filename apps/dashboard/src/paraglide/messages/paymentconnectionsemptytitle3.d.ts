export type LocalizedString = import("../runtime.js").LocalizedString;
export type Paymentconnectionsemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No payment connection yet" |
 *
 * @param {Paymentconnectionsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const paymentconnectionsemptytitle3: ((
  inputs?: Paymentconnectionsemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Paymentconnectionsemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { paymentconnectionsemptytitle3 as "paymentConnectionsEmptyTitle" };
