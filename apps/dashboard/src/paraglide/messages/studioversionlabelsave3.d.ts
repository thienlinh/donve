export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioversionlabelsave3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Save" |
 *
 * @param {Studioversionlabelsave3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioversionlabelsave3: ((
  inputs?: Studioversionlabelsave3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioversionlabelsave3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioversionlabelsave3 as "studioVersionLabelSave" };
