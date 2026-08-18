export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberspendingtitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pending invitations" |
 *
 * @param {Memberspendingtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberspendingtitle2: ((
  inputs?: Memberspendingtitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberspendingtitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberspendingtitle2 as "membersPendingTitle" };
