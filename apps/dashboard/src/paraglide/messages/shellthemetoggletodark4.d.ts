export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellthemetoggletodark4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Switch to dark mode" |
 *
 * @param {Shellthemetoggletodark4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellthemetoggletodark4: ((
  inputs?: Shellthemetoggletodark4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellthemetoggletodark4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellthemetoggletodark4 as "shellThemeToggleToDark" };
