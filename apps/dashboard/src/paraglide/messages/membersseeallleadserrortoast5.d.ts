export type LocalizedString = import("../runtime.js").LocalizedString;
export type Membersseeallleadserrortoast5Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to update lead visibility" |
 *
 * @param {Membersseeallleadserrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const membersseeallleadserrortoast5: ((
  inputs?: Membersseeallleadserrortoast5Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Membersseeallleadserrortoast5Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { membersseeallleadserrortoast5 as "membersSeeAllLeadsErrorToast" };
