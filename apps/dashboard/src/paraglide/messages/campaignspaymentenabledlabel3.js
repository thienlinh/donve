/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspaymentenabledlabel3Inputs */

const vi_campaignspaymentenabledlabel3 =
  /** @type {(inputs: Campaignspaymentenabledlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bật`;
  };

const en_campaignspaymentenabledlabel3 =
  /** @type {(inputs: Campaignspaymentenabledlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Enabled`;
  };

/**
 * | output |
 * | --- |
 * | "Enabled" |
 *
 * @param {Campaignspaymentenabledlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspaymentenabledlabel3 =
  /** @type {((inputs?: Campaignspaymentenabledlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspaymentenabledlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspaymentenabledlabel3(inputs);
      return vi_campaignspaymentenabledlabel3(inputs);
    }
  );
export { campaignspaymentenabledlabel3 as "campaignsPaymentEnabledLabel" };
