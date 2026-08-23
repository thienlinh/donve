export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonnext1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Next" |
 *
 * @param {Commonnext1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonnext1: ((
  inputs?: Commonnext1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonnext1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonnext1 as "commonNext" };
