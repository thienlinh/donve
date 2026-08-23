export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodrawundo2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Undo stroke" |
 *
 * @param {Studiodrawundo2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodrawundo2: ((
  inputs?: Studiodrawundo2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodrawundo2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodrawundo2 as "studioDrawUndo" };
