export type LocalizedString = import("../runtime.js").LocalizedString;
export type Routenotfounddescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "The page you're looking for doesn't exist or was moved." |
 *
 * @param {Routenotfounddescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const routenotfounddescription3: ((
  inputs?: Routenotfounddescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Routenotfounddescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { routenotfounddescription3 as "routeNotFoundDescription" };
