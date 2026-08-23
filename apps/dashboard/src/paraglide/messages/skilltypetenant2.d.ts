export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skilltypetenant2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Custom" |
 *
 * @param {Skilltypetenant2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skilltypetenant2: ((
  inputs?: Skilltypetenant2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skilltypetenant2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skilltypetenant2 as "skillTypeTenant" };
