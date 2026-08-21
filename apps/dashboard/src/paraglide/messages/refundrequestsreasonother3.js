/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsreasonother3Inputs */

const vi_refundrequestsreasonother3 =
  /** @type {(inputs: Refundrequestsreasonother3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khác`;
  };

const en_refundrequestsreasonother3 =
  /** @type {(inputs: Refundrequestsreasonother3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Other`;
  };

/**
 * | output |
 * | --- |
 * | "Other" |
 *
 * @param {Refundrequestsreasonother3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsreasonother3 =
  /** @type {((inputs?: Refundrequestsreasonother3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsreasonother3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsreasonother3(inputs);
      return vi_refundrequestsreasonother3(inputs);
    }
  );
export { refundrequestsreasonother3 as "refundRequestsReasonOther" };
