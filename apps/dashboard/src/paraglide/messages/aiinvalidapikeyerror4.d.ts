export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiinvalidapikeyerror4Inputs = {};
/**
 * | output |
 * | --- |
 * | "That key couldn't be validated with the provider." |
 *
 * @param {Aiinvalidapikeyerror4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiinvalidapikeyerror4: ((
  inputs?: Aiinvalidapikeyerror4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiinvalidapikeyerror4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiinvalidapikeyerror4 as "aiInvalidApiKeyError" };
