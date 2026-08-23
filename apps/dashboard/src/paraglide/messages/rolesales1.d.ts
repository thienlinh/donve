export type LocalizedString = import("../runtime.js").LocalizedString;
export type Rolesales1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Sales" |
 *
 * @param {Rolesales1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const rolesales1: ((
  inputs?: Rolesales1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Rolesales1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { rolesales1 as "roleSales" };
