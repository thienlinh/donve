export type LocalizedString = import("../runtime.js").LocalizedString;
export type Airemoveconfirmtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove this connection?" |
 *
 * @param {Airemoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const airemoveconfirmtitle3: ((
  inputs?: Airemoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Airemoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { airemoveconfirmtitle3 as "aiRemoveConfirmTitle" };
