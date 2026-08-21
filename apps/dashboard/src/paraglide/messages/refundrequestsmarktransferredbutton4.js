/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Refundrequestsmarktransferredbutton4Inputs */

const vi_refundrequestsmarktransferredbutton4 =
  /** @type {(inputs: Refundrequestsmarktransferredbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã chuyển khoản hoàn tiền`;
  };

const en_refundrequestsmarktransferredbutton4 =
  /** @type {(inputs: Refundrequestsmarktransferredbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mark refund as transferred`;
  };

/**
 * | output |
 * | --- |
 * | "Mark refund as transferred" |
 *
 * @param {Refundrequestsmarktransferredbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const refundrequestsmarktransferredbutton4 =
  /** @type {((inputs?: Refundrequestsmarktransferredbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Refundrequestsmarktransferredbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_refundrequestsmarktransferredbutton4(inputs);
      return vi_refundrequestsmarktransferredbutton4(inputs);
    }
  );
export { refundrequestsmarktransferredbutton4 as "refundRequestsMarkTransferredButton" };
