export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspromptplaceholder2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Describe the landing page you want…" |
 *
 * @param {Landingspromptplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspromptplaceholder2: ((
  inputs?: Landingspromptplaceholder2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspromptplaceholder2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspromptplaceholder2 as "landingsPromptPlaceholder" };
