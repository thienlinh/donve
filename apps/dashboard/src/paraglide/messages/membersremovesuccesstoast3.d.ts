export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersremovesuccesstoast3Inputs = {
  member: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "{member} removed from the organization" |
 *
 * @param {Membersremovesuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersremovesuccesstoast3: ((
  inputs: Membersremovesuccesstoast3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersremovesuccesstoast3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersremovesuccesstoast3 as "membersRemoveSuccessToast" };
