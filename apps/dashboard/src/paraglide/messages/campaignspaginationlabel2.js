/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} Campaignspaginationlabel2Inputs */

const vi_campaignspaginationlabel2 =
  /** @type {(inputs: Campaignspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Trang ${i?.page}/${i?.total}`;
  };

const en_campaignspaginationlabel2 =
  /** @type {(inputs: Campaignspaginationlabel2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Page ${i?.page} of ${i?.total}`;
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
const campaignspaginationlabel2 =
  /** @type {((inputs: Campaignspaginationlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspaginationlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspaginationlabel2(inputs);
      return vi_campaignspaginationlabel2(inputs);
    }
  );
export { campaignspaginationlabel2 as "campaignsPaginationLabel" };
