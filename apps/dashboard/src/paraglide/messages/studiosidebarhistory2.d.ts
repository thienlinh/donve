export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosidebarhistory2Inputs = {};
/**
 * | output |
 * | --- |
 * | "History" |
 *
 * @param {Studiosidebarhistory2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosidebarhistory2: ((
  inputs?: Studiosidebarhistory2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosidebarhistory2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosidebarhistory2 as "studioSidebarHistory" };
