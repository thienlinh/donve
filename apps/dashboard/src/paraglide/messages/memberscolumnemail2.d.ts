export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnemail2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Memberscolumnemail2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnemail2: ((
  inputs?: Memberscolumnemail2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnemail2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnemail2 as "membersColumnEmail" };
