export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawcolorlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Color" |
 *
 * @param {Studiodrawcolorlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawcolorlabel3: ((
  inputs?: Studiodrawcolorlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawcolorlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawcolorlabel3 as "studioDrawColorLabel" };
