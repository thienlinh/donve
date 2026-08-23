export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnactions2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Memberscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnactions2: ((
  inputs?: Memberscolumnactions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnactions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnactions2 as "membersColumnActions" };
