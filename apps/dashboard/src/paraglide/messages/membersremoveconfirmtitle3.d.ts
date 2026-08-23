export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersremoveconfirmtitle3Inputs = {
  member: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Remove {member}?" |
 *
 * @param {Membersremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersremoveconfirmtitle3: ((
  inputs: Membersremoveconfirmtitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersremoveconfirmtitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersremoveconfirmtitle3 as "membersRemoveConfirmTitle" };
