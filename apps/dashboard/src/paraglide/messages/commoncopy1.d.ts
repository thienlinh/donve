export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commoncopy1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Copy" |
 *
 * @param {Commoncopy1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commoncopy1: ((
  inputs?: Commoncopy1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commoncopy1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commoncopy1 as "commonCopy" };
