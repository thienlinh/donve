export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aisetdefaultaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Set as default" |
 *
 * @param {Aisetdefaultaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aisetdefaultaction3: ((
  inputs?: Aisetdefaultaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aisetdefaultaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aisetdefaultaction3 as "aiSetDefaultAction" };
