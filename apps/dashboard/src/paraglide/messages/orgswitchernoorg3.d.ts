export type LocalizedString = import("../runtime.js").LocalizedString
export type Orgswitchernoorg3Inputs = {}
/**
 * | output |
 * | --- |
 * | "No organization yet" |
 *
 * @param {Orgswitchernoorg3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const orgswitchernoorg3: ((
  inputs?: Orgswitchernoorg3Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Orgswitchernoorg3Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { orgswitchernoorg3 as "orgSwitcherNoOrg" }
