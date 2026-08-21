export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiogenerateerrorinsufficientcreditsdescription5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Top up your credit balance to keep generating." |
 *
 * @param {Studiogenerateerrorinsufficientcreditsdescription5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiogenerateerrorinsufficientcreditsdescription5: ((
  inputs?: Studiogenerateerrorinsufficientcreditsdescription5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiogenerateerrorinsufficientcreditsdescription5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiogenerateerrorinsufficientcreditsdescription5 as "studioGenerateErrorInsufficientCreditsDescription" };
