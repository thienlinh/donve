export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawtoolarrow3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Arrow" |
 *
 * @param {Studiodrawtoolarrow3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawtoolarrow3: ((
  inputs?: Studiodrawtoolarrow3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawtoolarrow3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawtoolarrow3 as "studioDrawToolArrow" };
