export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skilltypeplatform2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Platform" |
 *
 * @param {Skilltypeplatform2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skilltypeplatform2: ((
  inputs?: Skilltypeplatform2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skilltypeplatform2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skilltypeplatform2 as "skillTypePlatform" };
