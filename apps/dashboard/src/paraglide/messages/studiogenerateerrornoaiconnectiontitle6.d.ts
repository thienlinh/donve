export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiogenerateerrornoaiconnectiontitle6Inputs = {};
/**
 * | output |
 * | --- |
 * | "No AI connection set up" |
 *
 * @param {Studiogenerateerrornoaiconnectiontitle6Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiogenerateerrornoaiconnectiontitle6: ((
  inputs?: Studiogenerateerrornoaiconnectiontitle6Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiogenerateerrornoaiconnectiontitle6Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiogenerateerrornoaiconnectiontitle6 as "studioGenerateErrorNoAiConnectionTitle" };
