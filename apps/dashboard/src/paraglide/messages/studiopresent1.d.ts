export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopresent1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Present" |
 *
 * @param {Studiopresent1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopresent1: ((
  inputs?: Studiopresent1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopresent1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopresent1 as "studioPresent" };
