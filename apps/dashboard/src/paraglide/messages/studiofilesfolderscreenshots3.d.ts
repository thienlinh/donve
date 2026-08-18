export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesfolderscreenshots3Inputs = {};
/**
 * | output |
 * | --- |
 * | "screenshots/" |
 *
 * @param {Studiofilesfolderscreenshots3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesfolderscreenshots3: ((
  inputs?: Studiofilesfolderscreenshots3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesfolderscreenshots3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesfolderscreenshots3 as "studioFilesFolderScreenshots" };
