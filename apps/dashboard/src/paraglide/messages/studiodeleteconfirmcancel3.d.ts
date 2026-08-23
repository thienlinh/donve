export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeleteconfirmcancel3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Studiodeleteconfirmcancel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeleteconfirmcancel3: ((
  inputs?: Studiodeleteconfirmcancel3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeleteconfirmcancel3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeleteconfirmcancel3 as "studioDeleteConfirmCancel" };
