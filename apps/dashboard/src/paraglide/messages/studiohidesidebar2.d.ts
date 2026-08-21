export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiohidesidebar2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Hide sidebar" |
 *
 * @param {Studiohidesidebar2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiohidesidebar2: ((
  inputs?: Studiohidesidebar2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiohidesidebar2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiohidesidebar2 as "studioHideSidebar" };
