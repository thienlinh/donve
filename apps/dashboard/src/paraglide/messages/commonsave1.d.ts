export type LocalizedString = import("../runtime.js").LocalizedString;
export type Commonsave1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Commonsave1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonsave1: ((
  inputs?: Commonsave1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonsave1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { commonsave1 as "commonSave" };
