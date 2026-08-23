export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodeleteconfirmdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "It has several child elements or covers a large part of the page. You can undo this with Cmd+Z." |
 *
 * @param {Studiodeleteconfirmdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodeleteconfirmdescription3: ((
  inputs?: Studiodeleteconfirmdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodeleteconfirmdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodeleteconfirmdescription3 as "studioDeleteConfirmDescription" };
