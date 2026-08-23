export type LocalizedString = import("../runtime.js").LocalizedString;
export type Roleadmin1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Admin" |
 *
 * @param {Roleadmin1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const roleadmin1: ((
  inputs?: Roleadmin1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Roleadmin1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { roleadmin1 as "roleAdmin" };
