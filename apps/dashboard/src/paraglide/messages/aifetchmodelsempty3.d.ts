export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aifetchmodelsempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No available models found." |
 *
 * @param {Aifetchmodelsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aifetchmodelsempty3: ((
  inputs?: Aifetchmodelsempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aifetchmodelsempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aifetchmodelsempty3 as "aiFetchModelsEmpty" };
