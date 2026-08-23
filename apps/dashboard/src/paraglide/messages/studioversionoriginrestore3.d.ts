export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionoriginrestore3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Restored" |
 *
 * @param {Studioversionoriginrestore3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionoriginrestore3: ((
  inputs?: Studioversionoriginrestore3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionoriginrestore3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionoriginrestore3 as "studioVersionOriginRestore" };
