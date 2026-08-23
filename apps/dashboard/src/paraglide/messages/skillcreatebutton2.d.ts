export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillcreatebutton2Inputs = {};
/**
 * | output |
 * | --- |
 * | "New skill" |
 *
 * @param {Skillcreatebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillcreatebutton2: ((
  inputs?: Skillcreatebutton2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillcreatebutton2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillcreatebutton2 as "skillCreateButton" };
