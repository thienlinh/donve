export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiotabdesignfiles3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Design Files" |
 *
 * @param {Studiotabdesignfiles3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiotabdesignfiles3: ((
  inputs?: Studiotabdesignfiles3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiotabdesignfiles3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiotabdesignfiles3 as "studioTabDesignFiles" };
