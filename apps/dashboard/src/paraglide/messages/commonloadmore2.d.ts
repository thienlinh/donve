export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonloadmore2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Load more" |
 *
 * @param {Commonloadmore2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonloadmore2: ((
  inputs?: Commonloadmore2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonloadmore2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonloadmore2 as "commonLoadMore" };
