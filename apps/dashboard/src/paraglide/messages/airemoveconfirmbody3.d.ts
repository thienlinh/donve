export type LocalizedString = import("../runtime.js").LocalizedString;
export type Airemoveconfirmbody3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Generations won't be able to use this key anymore." |
 *
 * @param {Airemoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const airemoveconfirmbody3: ((
  inputs?: Airemoveconfirmbody3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Airemoveconfirmbody3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { airemoveconfirmbody3 as "aiRemoveConfirmBody" };
