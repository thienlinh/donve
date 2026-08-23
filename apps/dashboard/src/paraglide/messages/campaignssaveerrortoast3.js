/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignssaveerrortoast3Inputs */

const vi_campaignssaveerrortoast3 =
  /** @type {(inputs: Campaignssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được chiến dịch này. Thử lại.`;
  };

const en_campaignssaveerrortoast3 =
  /** @type {(inputs: Campaignssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this campaign. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this campaign. Try again." |
 *
 * @param {Campaignssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignssaveerrortoast3 =
  /** @type {((inputs?: Campaignssaveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignssaveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignssaveerrortoast3(inputs);
      return vi_campaignssaveerrortoast3(inputs);
    }
  );
export { campaignssaveerrortoast3 as "campaignsSaveErrorToast" };
