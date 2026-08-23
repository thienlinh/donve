export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosidebarfiles2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Files" |
 *
 * @param {Studiosidebarfiles2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosidebarfiles2: ((
  inputs?: Studiosidebarfiles2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosidebarfiles2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosidebarfiles2 as "studioSidebarFiles" };
