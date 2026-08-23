export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversiondiffpreviewtab4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Preview" |
 *
 * @param {Studioversiondiffpreviewtab4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversiondiffpreviewtab4: ((
  inputs?: Studioversiondiffpreviewtab4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversiondiffpreviewtab4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversiondiffpreviewtab4 as "studioVersionDiffPreviewTab" };
