export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonedit1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Commonedit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonedit1: ((
  inputs?: Commonedit1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonedit1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonedit1 as "commonEdit" };
