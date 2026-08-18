export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingsfilterdraft2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Draft" |
 *
 * @param {Landingsfilterdraft2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingsfilterdraft2: ((
  inputs?: Landingsfilterdraft2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingsfilterdraft2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingsfilterdraft2 as "landingsFilterDraft" };
