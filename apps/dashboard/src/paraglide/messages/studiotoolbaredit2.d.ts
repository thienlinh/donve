export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotoolbaredit2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Studiotoolbaredit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotoolbaredit2: ((
  inputs?: Studiotoolbaredit2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotoolbaredit2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotoolbaredit2 as "studioToolbarEdit" };
