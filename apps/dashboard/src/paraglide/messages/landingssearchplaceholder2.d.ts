export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingssearchplaceholder2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Search by name…" |
 *
 * @param {Landingssearchplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingssearchplaceholder2: ((
  inputs?: Landingssearchplaceholder2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingssearchplaceholder2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingssearchplaceholder2 as "landingsSearchPlaceholder" };
