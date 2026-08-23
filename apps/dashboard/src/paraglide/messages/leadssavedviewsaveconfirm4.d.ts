export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewsaveconfirm4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save view" |
 *
 * @param {Leadssavedviewsaveconfirm4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewsaveconfirm4: ((
  inputs?: Leadssavedviewsaveconfirm4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewsaveconfirm4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewsaveconfirm4 as "leadsSavedViewSaveConfirm" };
