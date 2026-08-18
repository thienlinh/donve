export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofileslightboxempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No thumbnail captured yet — it's taken automatically after the next save." |
 *
 * @param {Studiofileslightboxempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofileslightboxempty3: ((
  inputs?: Studiofileslightboxempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofileslightboxempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofileslightboxempty3 as "studioFilesLightboxEmpty" };
