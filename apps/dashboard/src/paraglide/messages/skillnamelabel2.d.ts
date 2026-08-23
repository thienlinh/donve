export type LocalizedString = import("../runtime.js").LocalizedString;
export type Skillnamelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Skillnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const skillnamelabel2: ((
  inputs?: Skillnamelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Skillnamelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { skillnamelabel2 as "skillNameLabel" };
