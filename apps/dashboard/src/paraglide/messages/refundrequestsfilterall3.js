/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsfilterall3Inputs */

const vi_refundrequestsfilterall3 =
  /** @type {(inputs: Refundrequestsfilterall3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tất cả trạng thái`;
  };

const en_refundrequestsfilterall3 =
  /** @type {(inputs: Refundrequestsfilterall3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `All statuses`;
  };

/**
 * | output |
 * | --- |
 * | "All statuses" |
 *
 * @param {Refundrequestsfilterall3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsfilterall3 =
  /** @type {((inputs?: Refundrequestsfilterall3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsfilterall3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsfilterall3(inputs);
      return vi_refundrequestsfilterall3(inputs);
    }
  );
export { refundrequestsfilterall3 as "refundRequestsFilterAll" };
