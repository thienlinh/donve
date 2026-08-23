export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssavedviewsaveerrortoast5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't save this view. Try again." |
 *
 * @param {Leadssavedviewsaveerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssavedviewsaveerrortoast5: ((
  inputs?: Leadssavedviewsaveerrortoast5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssavedviewsaveerrortoast5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssavedviewsaveerrortoast5 as "leadsSavedViewSaveErrorToast" };
