/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestscompleteerrortoast4Inputs */

const vi_refundrequestscompleteerrortoast4 =
  /** @type {(inputs: Refundrequestscompleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể đánh dấu đã hoàn tiền. Vui lòng thử lại.`;
  };

const en_refundrequestscompleteerrortoast4 =
  /** @type {(inputs: Refundrequestscompleteerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't mark this refund as transferred. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't mark this refund as transferred. Try again." |
 *
 * @param {Refundrequestscompleteerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestscompleteerrortoast4 =
  /** @type {((inputs?: Refundrequestscompleteerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestscompleteerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestscompleteerrortoast4(inputs);
      return vi_refundrequestscompleteerrortoast4(inputs);
    }
  );
export { refundrequestscompleteerrortoast4 as "refundRequestsCompleteErrorToast" };
