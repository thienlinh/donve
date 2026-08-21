export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignspaginationlabel2Inputs = {
  page: NonNullable<unknown>;
  total: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Page {page} of {total}" |
 *
 * @param {Campaignspaginationlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignspaginationlabel2: ((
  inputs: Campaignspaginationlabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignspaginationlabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignspaginationlabel2 as "campaignsPaginationLabel" };
