export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbartweaks2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Tweaks" |
 *
 * @param {Studiotoolbartweaks2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbartweaks2: ((
  inputs?: Studiotoolbartweaks2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbartweaks2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbartweaks2 as "studioToolbarTweaks" };
