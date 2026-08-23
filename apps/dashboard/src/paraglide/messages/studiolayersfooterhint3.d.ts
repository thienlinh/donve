export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiolayersfooterhint3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Top of list = topmost layer. Click the eye icon to hide." |
 *
 * @param {Studiolayersfooterhint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiolayersfooterhint3: ((
  inputs?: Studiolayersfooterhint3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiolayersfooterhint3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiolayersfooterhint3 as "studioLayersFooterHint" };
