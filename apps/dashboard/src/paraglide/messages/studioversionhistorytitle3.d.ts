export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionhistorytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Version history" |
 *
 * @param {Studioversionhistorytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionhistorytitle3: ((
  inputs?: Studioversionhistorytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionhistorytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionhistorytitle3 as "studioVersionHistoryTitle" };
