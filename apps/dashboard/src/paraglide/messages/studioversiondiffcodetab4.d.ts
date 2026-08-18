export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversiondiffcodetab4Inputs = {};
/**
 * | output |
 * | --- |
 * | "HTML diff" |
 *
 * @param {Studioversiondiffcodetab4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversiondiffcodetab4: ((
  inputs?: Studioversiondiffcodetab4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversiondiffcodetab4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversiondiffcodetab4 as "studioVersionDiffCodeTab" };
