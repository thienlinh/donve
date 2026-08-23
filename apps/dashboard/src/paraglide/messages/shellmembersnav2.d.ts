export type LocalizedString = import("../runtime.js").LocalizedString;
export type Shellmembersnav2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Members" |
 *
 * @param {Shellmembersnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellmembersnav2: ((
  inputs?: Shellmembersnav2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellmembersnav2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { shellmembersnav2 as "shellMembersNav" };
