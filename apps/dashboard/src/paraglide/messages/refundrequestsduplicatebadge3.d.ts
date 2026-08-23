export type LocalizedString = import("../runtime.js").LocalizedString;
export type Refundrequestsduplicatebadge3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Duplicate payment" |
 *
 * @param {Refundrequestsduplicatebadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const refundrequestsduplicatebadge3: ((
  inputs?: Refundrequestsduplicatebadge3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Refundrequestsduplicatebadge3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { refundrequestsduplicatebadge3 as "refundRequestsDuplicateBadge" };
