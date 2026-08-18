export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersrolelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Role" |
 *
 * @param {Membersrolelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersrolelabel2: ((
  inputs?: Membersrolelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersrolelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersrolelabel2 as "membersRoleLabel" };
