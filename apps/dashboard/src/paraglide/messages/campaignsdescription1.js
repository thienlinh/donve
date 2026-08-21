/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsdescription1Inputs */

const vi_campaignsdescription1 =
  /** @type {(inputs: Campaignsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phễu kết nối sản phẩm, landing page và thanh toán.`;
  };

const en_campaignsdescription1 =
  /** @type {(inputs: Campaignsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Funnels that connect products, landing pages, and checkout.`;
  };

/**
 * | output |
 * | --- |
 * | "Funnels that connect products, landing pages, and checkout." |
 *
 * @param {Campaignsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsdescription1 =
  /** @type {((inputs?: Campaignsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsdescription1(inputs);
      return vi_campaignsdescription1(inputs);
    }
  );
export { campaignsdescription1 as "campaignsDescription" };
