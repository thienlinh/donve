export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeleteconfirmtitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Delete this section?" |
 *
 * @param {Studiodeleteconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeleteconfirmtitle3: ((
  inputs?: Studiodeleteconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeleteconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeleteconfirmtitle3 as "studioDeleteConfirmTitle" };
