export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skilldialogdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Write the instructions in Markdown — the preview renders exactly what the AI sees." |
 *
 * @param {Skilldialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skilldialogdescription2: ((
  inputs?: Skilldialogdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skilldialogdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skilldialogdescription2 as "skillDialogDescription" };
