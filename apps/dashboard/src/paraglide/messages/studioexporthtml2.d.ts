export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioexporthtml2Inputs = {};
/**
 * | output |
 * | --- |
 * | "HTML" |
 *
 * @param {Studioexporthtml2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioexporthtml2: ((
  inputs?: Studioexporthtml2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioexporthtml2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioexporthtml2 as "studioExportHtml" };
