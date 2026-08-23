export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonback1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Back" |
 *
 * @param {Commonback1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonback1: ((
  inputs?: Commonback1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonback1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonback1 as "commonBack" };
