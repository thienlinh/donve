export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshare1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Share" |
 *
 * @param {Studioshare1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshare1: ((
  inputs?: Studioshare1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshare1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshare1 as "studioShare" };
