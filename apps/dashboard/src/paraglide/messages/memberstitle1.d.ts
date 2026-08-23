export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberstitle1Inputs = {};
/**
 * | output |
 * | --- |
 * | "Members" |
 *
 * @param {Memberstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberstitle1: ((
  inputs?: Memberstitle1Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberstitle1Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberstitle1 as "membersTitle" };
