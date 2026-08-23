export type LocalizedString = import("../runtime.js").LocalizedString;
export type Routenotfoundtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Page not found" |
 *
 * @param {Routenotfoundtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const routenotfoundtitle3: ((
  inputs?: Routenotfoundtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Routenotfoundtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { routenotfoundtitle3 as "routeNotFoundTitle" };
