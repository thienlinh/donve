export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesrefreshlabel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Refresh" |
 *
 * @param {Studiofilesrefreshlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesrefreshlabel3: ((
  inputs?: Studiofilesrefreshlabel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesrefreshlabel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesrefreshlabel3 as "studioFilesRefreshLabel" };
