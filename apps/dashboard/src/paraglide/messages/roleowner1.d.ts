export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roleowner1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Owner" |
 *
 * @param {Roleowner1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const roleowner1: ((
  inputs?: Roleowner1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Roleowner1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { roleowner1 as "roleOwner" };
