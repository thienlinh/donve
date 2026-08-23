export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commoncreate1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Create" |
 *
 * @param {Commoncreate1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commoncreate1: ((
  inputs?: Commoncreate1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commoncreate1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commoncreate1 as "commonCreate" };
