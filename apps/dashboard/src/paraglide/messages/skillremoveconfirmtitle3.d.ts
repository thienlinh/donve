export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillremoveconfirmtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove this skill?" |
 *
 * @param {Skillremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillremoveconfirmtitle3: ((
  inputs?: Skillremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillremoveconfirmtitle3 as "skillRemoveConfirmTitle" };
