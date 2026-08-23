export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberscolumnseeallleads4Inputs = {};
/**
 * | output |
 * | --- |
 * | "See all leads" |
 *
 * @param {Memberscolumnseeallleads4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberscolumnseeallleads4: ((
  inputs?: Memberscolumnseeallleads4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberscolumnseeallleads4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberscolumnseeallleads4 as "membersColumnSeeAllLeads" };
