/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsloaderrortitle4Inputs */

const vi_refundrequestsloaderrortitle4 =
  /** @type {(inputs: Refundrequestsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách yêu cầu hoàn tiền`;
  };

const en_refundrequestsloaderrortitle4 =
  /** @type {(inputs: Refundrequestsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load refund requests`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load refund requests" |
 *
 * @param {Refundrequestsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsloaderrortitle4 =
  /** @type {((inputs?: Refundrequestsloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsloaderrortitle4(inputs);
      return vi_refundrequestsloaderrortitle4(inputs);
    }
  );
export { refundrequestsloaderrortitle4 as "refundRequestsLoadErrorTitle" };
