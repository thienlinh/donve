/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopupmanualpendingtitle4Inputs */

const vi_campaignspopupmanualpendingtitle4 =
  /** @type {(inputs: Campaignspopupmanualpendingtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang chờ xác nhận thủ công`;
  };

const en_campaignspopupmanualpendingtitle4 =
  /** @type {(inputs: Campaignspopupmanualpendingtitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Awaiting manual confirmation`;
  };

/**
 * | output |
 * | --- |
 * | "Awaiting manual confirmation" |
 *
 * @param {Campaignspopupmanualpendingtitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopupmanualpendingtitle4 =
  /** @type {((inputs?: Campaignspopupmanualpendingtitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopupmanualpendingtitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopupmanualpendingtitle4(inputs);
      return vi_campaignspopupmanualpendingtitle4(inputs);
    }
  );
export { campaignspopupmanualpendingtitle4 as "campaignsPopupManualPendingTitle" };
