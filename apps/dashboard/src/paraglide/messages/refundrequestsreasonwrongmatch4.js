/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsreasonwrongmatch4Inputs */

const vi_refundrequestsreasonwrongmatch4 =
  /** @type {(inputs: Refundrequestsreasonwrongmatch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gán nhầm đơn hàng`;
  };

const en_refundrequestsreasonwrongmatch4 =
  /** @type {(inputs: Refundrequestsreasonwrongmatch4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Wrong order match`;
  };

/**
 * | output |
 * | --- |
 * | "Wrong order match" |
 *
 * @param {Refundrequestsreasonwrongmatch4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsreasonwrongmatch4 =
  /** @type {((inputs?: Refundrequestsreasonwrongmatch4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsreasonwrongmatch4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsreasonwrongmatch4(inputs);
      return vi_refundrequestsreasonwrongmatch4(inputs);
    }
  );
export { refundrequestsreasonwrongmatch4 as "refundRequestsReasonWrongMatch" };
