export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnexpires2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Expires" |
 *
 * @param {Memberscolumnexpires2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnexpires2: ((
  inputs?: Memberscolumnexpires2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnexpires2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnexpires2 as "membersColumnExpires" };
