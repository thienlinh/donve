export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiosidebarinspect2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Inspect" |
 *
 * @param {Studiosidebarinspect2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiosidebarinspect2: ((
  inputs?: Studiosidebarinspect2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiosidebarinspect2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiosidebarinspect2 as "studioSidebarInspect" };
