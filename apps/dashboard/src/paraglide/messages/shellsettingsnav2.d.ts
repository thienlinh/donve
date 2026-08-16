export type LocalizedString = import("../runtime.js").LocalizedString
export type Shellsettingsnav2Inputs = {}
/**
 * | output |
 * | --- |
 * | "Settings" |
 *
 * @param {Shellsettingsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellsettingsnav2: ((
  inputs?: Shellsettingsnav2Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellsettingsnav2Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { shellsettingsnav2 as "shellSettingsNav" }
