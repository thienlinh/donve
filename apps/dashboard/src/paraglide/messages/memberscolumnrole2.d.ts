export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnrole2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Role" |
 *
 * @param {Memberscolumnrole2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnrole2: ((
  inputs?: Memberscolumnrole2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnrole2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnrole2 as "membersColumnRole" };
