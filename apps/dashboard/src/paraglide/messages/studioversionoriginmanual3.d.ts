export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionoriginmanual3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Manual edit" |
 *
 * @param {Studioversionoriginmanual3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionoriginmanual3: ((
  inputs?: Studioversionoriginmanual3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionoriginmanual3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionoriginmanual3 as "studioVersionOriginManual" };
