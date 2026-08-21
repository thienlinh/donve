export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aifetchmodelserror3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load models for this key — check it's correct." |
 *
 * @param {Aifetchmodelserror3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aifetchmodelserror3: ((
  inputs?: Aifetchmodelserror3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aifetchmodelserror3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aifetchmodelserror3 as "aiFetchModelsError" };
