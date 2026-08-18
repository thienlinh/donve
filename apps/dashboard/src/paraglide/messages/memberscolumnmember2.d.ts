export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnmember2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Member" |
 *
 * @param {Memberscolumnmember2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnmember2: ((
  inputs?: Memberscolumnmember2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnmember2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnmember2 as "membersColumnMember" };
