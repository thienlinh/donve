/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsstatusrejected3Inputs */

const vi_refundrequestsstatusrejected3 =
  /** @type {(inputs: Refundrequestsstatusrejected3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã từ chối`;
  };

const en_refundrequestsstatusrejected3 =
  /** @type {(inputs: Refundrequestsstatusrejected3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rejected`;
  };

/**
 * | output |
 * | --- |
 * | "Rejected" |
 *
 * @param {Refundrequestsstatusrejected3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsstatusrejected3 =
  /** @type {((inputs?: Refundrequestsstatusrejected3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsstatusrejected3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsstatusrejected3(inputs);
      return vi_refundrequestsstatusrejected3(inputs);
    }
  );
export { refundrequestsstatusrejected3 as "refundRequestsStatusRejected" };
