/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aitrialremaininglowwarning4Inputs */

const vi_aitrialremaininglowwarning4 =
  /** @type {(inputs: Aitrialremaininglowwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bạn sắp dùng hết lượt dùng thử miễn phí — kết nối API key riêng để tiếp tục tạo trang.`;
  };

const en_aitrialremaininglowwarning4 =
  /** @type {(inputs: Aitrialremaininglowwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `You're almost out of free trial uses — connect your own API key to keep generating.`;
  };

/**
 * | output |
 * | --- |
 * | "You're almost out of free trial uses — connect your own API key to keep generating." |
 *
 * @param {Aitrialremaininglowwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aitrialremaininglowwarning4 =
  /** @type {((inputs?: Aitrialremaininglowwarning4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aitrialremaininglowwarning4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aitrialremaininglowwarning4(inputs);
      return vi_aitrialremaininglowwarning4(inputs);
    }
  );
export { aitrialremaininglowwarning4 as "aiTrialRemainingLowWarning" };
