export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonall1Inputs = {};
/**
 * | output |
 * | --- |
 * | "All" |
 *
 * @param {Commonall1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonall1: ((
  inputs?: Commonall1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonall1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonall1 as "commonAll" };
