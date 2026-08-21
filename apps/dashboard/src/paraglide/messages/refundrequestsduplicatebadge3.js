/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsduplicatebadge3Inputs */

const vi_refundrequestsduplicatebadge3 =
  /** @type {(inputs: Refundrequestsduplicatebadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thanh toán trùng`;
  };

const en_refundrequestsduplicatebadge3 =
  /** @type {(inputs: Refundrequestsduplicatebadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Duplicate payment`;
  };

/**
 * | output |
 * | --- |
 * | "Duplicate payment" |
 *
 * @param {Refundrequestsduplicatebadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsduplicatebadge3 =
  /** @type {((inputs?: Refundrequestsduplicatebadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsduplicatebadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsduplicatebadge3(inputs);
      return vi_refundrequestsduplicatebadge3(inputs);
    }
  );
export { refundrequestsduplicatebadge3 as "refundRequestsDuplicateBadge" };
