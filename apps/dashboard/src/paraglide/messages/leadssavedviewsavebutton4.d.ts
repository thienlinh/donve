export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewsavebutton4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save view" |
 *
 * @param {Leadssavedviewsavebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewsavebutton4: ((
  inputs?: Leadssavedviewsavebutton4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewsavebutton4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewsavebutton4 as "leadsSavedViewSaveButton" };
