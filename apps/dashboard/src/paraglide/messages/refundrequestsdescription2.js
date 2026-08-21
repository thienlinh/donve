/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsdescription2Inputs */

const vi_refundrequestsdescription2 =
  /** @type {(inputs: Refundrequestsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Theo dõi hoàn tiền thủ công — nền tảng không giữ tiền, bạn tự chuyển khoản hoàn tiền rồi đánh dấu đã hoàn thành tại đây.`;
  };

const en_refundrequestsdescription2 =
  /** @type {(inputs: Refundrequestsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manual refund tracking — the platform never holds funds, so you transfer the refund yourself and mark it done here.`;
  };

/**
 * | output |
 * | --- |
 * | "Manual refund tracking — the platform never holds funds, so you transfer the refund yourself and mark it done here." |
 *
 * @param {Refundrequestsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsdescription2 =
  /** @type {((inputs?: Refundrequestsdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_refundrequestsdescription2(inputs);
      return vi_refundrequestsdescription2(inputs);
    }
  );
export { refundrequestsdescription2 as "refundRequestsDescription" };
