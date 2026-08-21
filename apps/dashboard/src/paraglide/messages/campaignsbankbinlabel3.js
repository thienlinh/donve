/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsbankbinlabel3Inputs */

const vi_campaignsbankbinlabel3 =
  /** @type {(inputs: Campaignsbankbinlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mã ngân hàng (BIN)`;
  };

const en_campaignsbankbinlabel3 =
  /** @type {(inputs: Campaignsbankbinlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bank BIN`;
  };

/**
 * | output |
 * | --- |
 * | "Bank BIN" |
 *
 * @param {Campaignsbankbinlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsbankbinlabel3 =
  /** @type {((inputs?: Campaignsbankbinlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsbankbinlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsbankbinlabel3(inputs);
      return vi_campaignsbankbinlabel3(inputs);
    }
  );
export { campaignsbankbinlabel3 as "campaignsBankBinLabel" };
