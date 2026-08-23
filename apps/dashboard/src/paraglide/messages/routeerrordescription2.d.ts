export type LocalizedString = import("../runtime.js").LocalizedString;
export type Routeerrordescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "This page couldn't be loaded. Try again or go back." |
 *
 * @param {Routeerrordescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const routeerrordescription2: ((
  inputs?: Routeerrordescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Routeerrordescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { routeerrordescription2 as "routeErrorDescription" };
