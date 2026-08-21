/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsemptytitle3Inputs */

const vi_refundrequestsemptytitle3 =
  /** @type {(inputs: Refundrequestsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không có yêu cầu hoàn tiền`;
  };

const en_refundrequestsemptytitle3 =
  /** @type {(inputs: Refundrequestsemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No refund requests`;
  };

/**
 * | output |
 * | --- |
 * | "No refund requests" |
 *
 * @param {Refundrequestsemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsemptytitle3 =
  /** @type {((inputs?: Refundrequestsemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsemptytitle3(inputs);
      return vi_refundrequestsemptytitle3(inputs);
    }
  );
export { refundrequestsemptytitle3 as "refundRequestsEmptyTitle" };
