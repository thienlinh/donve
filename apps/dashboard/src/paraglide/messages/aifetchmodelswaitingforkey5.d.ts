export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aifetchmodelswaitingforkey5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Enter an API key to load models" |
 *
 * @param {Aifetchmodelswaitingforkey5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aifetchmodelswaitingforkey5: ((
  inputs?: Aifetchmodelswaitingforkey5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aifetchmodelswaitingforkey5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aifetchmodelswaitingforkey5 as "aiFetchModelsWaitingForKey" };
