export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roleeditor1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Editor" |
 *
 * @param {Roleeditor1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const roleeditor1: ((
  inputs?: Roleeditor1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Roleeditor1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { roleeditor1 as "roleEditor" };
