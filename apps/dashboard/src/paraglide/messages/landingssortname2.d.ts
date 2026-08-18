export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingssortname2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Landingssortname2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingssortname2: ((
  inputs?: Landingssortname2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingssortname2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingssortname2 as "landingsSortName" };
