export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingscardactionslabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Landing page actions" |
 *
 * @param {Landingscardactionslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingscardactionslabel3: ((
  inputs?: Landingscardactionslabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingscardactionslabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingscardactionslabel3 as "landingsCardActionsLabel" };
