export type LocalizedString = import("../runtime.js").LocalizedString;
export type Routenotfoundbackbutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Back to home" |
 *
 * @param {Routenotfoundbackbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const routenotfoundbackbutton4: ((
  inputs?: Routenotfoundbackbutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Routenotfoundbackbutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { routenotfoundbackbutton4 as "routeNotFoundBackButton" };
