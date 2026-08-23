export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commoncancel1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Commoncancel1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commoncancel1: ((
  inputs?: Commoncancel1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commoncancel1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commoncancel1 as "commonCancel" };
