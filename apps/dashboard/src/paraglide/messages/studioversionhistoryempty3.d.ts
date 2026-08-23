export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionhistoryempty3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No versions yet." |
 *
 * @param {Studioversionhistoryempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionhistoryempty3: ((
  inputs?: Studioversionhistoryempty3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionhistoryempty3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionhistoryempty3 as "studioVersionHistoryEmpty" };
