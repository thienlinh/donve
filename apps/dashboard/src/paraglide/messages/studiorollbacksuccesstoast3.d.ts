export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiorollbacksuccesstoast3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rolled back" |
 *
 * @param {Studiorollbacksuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiorollbacksuccesstoast3: ((
  inputs?: Studiorollbacksuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiorollbacksuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiorollbacksuccesstoast3 as "studioRollbackSuccessToast" };
