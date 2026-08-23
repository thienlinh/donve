export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersremoveconfirmaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Remove member" |
 *
 * @param {Membersremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersremoveconfirmaction3: ((
  inputs?: Membersremoveconfirmaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersremoveconfirmaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersremoveconfirmaction3 as "membersRemoveConfirmAction" };
