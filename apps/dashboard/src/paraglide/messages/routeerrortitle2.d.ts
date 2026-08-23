export type LocalizedString = import("../runtime.js").LocalizedString;
export type Routeerrortitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Something went wrong" |
 *
 * @param {Routeerrortitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const routeerrortitle2: ((
  inputs?: Routeerrortitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Routeerrortitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { routeerrortitle2 as "routeErrorTitle" };
