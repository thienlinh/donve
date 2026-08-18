export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studionew1Inputs = {};
/**
 * | output |
 * | --- |
 * | "New" |
 *
 * @param {Studionew1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studionew1: ((
  inputs?: Studionew1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studionew1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studionew1 as "studioNew" };
