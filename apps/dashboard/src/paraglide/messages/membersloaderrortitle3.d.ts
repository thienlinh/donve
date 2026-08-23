export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersloaderrortitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Couldn't load members" |
 *
 * @param {Membersloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersloaderrortitle3: ((
  inputs?: Membersloaderrortitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersloaderrortitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersloaderrortitle3 as "membersLoadErrorTitle" };
