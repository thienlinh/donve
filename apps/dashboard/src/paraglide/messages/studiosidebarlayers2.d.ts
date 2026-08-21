export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosidebarlayers2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Layers" |
 *
 * @param {Studiosidebarlayers2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosidebarlayers2: ((
  inputs?: Studiosidebarlayers2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosidebarlayers2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosidebarlayers2 as "studioSidebarLayers" };
