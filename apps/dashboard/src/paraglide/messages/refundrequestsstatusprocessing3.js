/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsstatusprocessing3Inputs */

const vi_refundrequestsstatusprocessing3 =
  /** @type {(inputs: Refundrequestsstatusprocessing3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang xử lý`;
  };

const en_refundrequestsstatusprocessing3 =
  /** @type {(inputs: Refundrequestsstatusprocessing3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Processing`;
  };

/**
 * | output |
 * | --- |
 * | "Processing" |
 *
 * @param {Refundrequestsstatusprocessing3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsstatusprocessing3 =
  /** @type {((inputs?: Refundrequestsstatusprocessing3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsstatusprocessing3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsstatusprocessing3(inputs);
      return vi_refundrequestsstatusprocessing3(inputs);
    }
  );
export { refundrequestsstatusprocessing3 as "refundRequestsStatusProcessing" };
