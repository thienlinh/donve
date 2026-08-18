export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofilesfolderassets3Inputs = {};
/**
 * | output |
 * | --- |
 * | "assets/" |
 *
 * @param {Studiofilesfolderassets3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofilesfolderassets3: ((
  inputs?: Studiofilesfolderassets3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofilesfolderassets3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofilesfolderassets3 as "studioFilesFolderAssets" };
