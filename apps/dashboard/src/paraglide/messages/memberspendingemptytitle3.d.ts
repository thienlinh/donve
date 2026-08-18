export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberspendingemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No pending invitations" |
 *
 * @param {Memberspendingemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberspendingemptytitle3: ((
  inputs?: Memberspendingemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberspendingemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberspendingemptytitle3 as "membersPendingEmptyTitle" };
