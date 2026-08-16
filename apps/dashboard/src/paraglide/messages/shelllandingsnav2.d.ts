export type LocalizedString = import("../runtime.js").LocalizedString
export type Shelllandingsnav2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Landing Pages" |
 *
 * @param {Shelllandingsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shelllandingsnav2: ((
  inputs?: Shelllandingsnav2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shelllandingsnav2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { shelllandingsnav2 as "shellLandingsNav" }
