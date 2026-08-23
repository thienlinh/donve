export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadsactionzalo2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Zalo" |
 *
 * @param {Leadsactionzalo2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadsactionzalo2: ((
  inputs?: Leadsactionzalo2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadsactionzalo2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadsactionzalo2 as "leadsActionZalo" };
