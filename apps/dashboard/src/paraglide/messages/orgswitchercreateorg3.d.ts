export type LocalizedString = import("../runtime.js").LocalizedString
export type Orgswitchercreateorg3Inputs = {}
/**
 * | output |
 * | --- |
 * | "Create new organization" |
 *
 * @param {Orgswitchercreateorg3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const orgswitchercreateorg3: ((
  inputs?: Orgswitchercreateorg3Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Orgswitchercreateorg3Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { orgswitchercreateorg3 as "orgSwitcherCreateOrg" }
