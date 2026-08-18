export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeleteconfirmaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Studiodeleteconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeleteconfirmaction3: ((
  inputs?: Studiodeleteconfirmaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeleteconfirmaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeleteconfirmaction3 as "studioDeleteConfirmAction" };
