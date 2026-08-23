export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aidefaultmodellabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Default model" |
 *
 * @param {Aidefaultmodellabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aidefaultmodellabel3: ((
  inputs?: Aidefaultmodellabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aidefaultmodellabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aidefaultmodellabel3 as "aiDefaultModelLabel" };
