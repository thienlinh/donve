export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellainav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "AI" |
 *
 * @param {Shellainav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellainav2: ((
  inputs?: Shellainav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellainav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellainav2 as "shellAiNav" };
