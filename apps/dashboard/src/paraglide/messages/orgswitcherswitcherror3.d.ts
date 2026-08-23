export type LocalizedString = import("../runtime.js").LocalizedString;
export type Orgswitcherswitcherror3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't switch organizations. Try again." |
 *
 * @param {Orgswitcherswitcherror3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const orgswitcherswitcherror3: ((
  inputs?: Orgswitcherswitcherror3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Orgswitcherswitcherror3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { orgswitcherswitcherror3 as "orgSwitcherSwitchError" };
