export type LocalizedString = import("../runtime.js").LocalizedString
export type Shelllogout1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Log out" |
 *
 * @param {Shelllogout1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shelllogout1: ((
  inputs?: Shelllogout1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shelllogout1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { shelllogout1 as "shellLogout" }
