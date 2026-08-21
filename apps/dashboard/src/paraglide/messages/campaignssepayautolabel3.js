/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignssepayautolabel3Inputs */

const vi_campaignssepayautolabel3 =
  /** @type {(inputs: Campaignssepayautolabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tự động đối soát qua SePay`;
  };

const en_campaignssepayautolabel3 =
  /** @type {(inputs: Campaignssepayautolabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Auto-reconcile via SePay`;
  };

/**
 * | output |
 * | --- |
 * | "Auto-reconcile via SePay" |
 *
 * @param {Campaignssepayautolabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignssepayautolabel3 =
  /** @type {((inputs?: Campaignssepayautolabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignssepayautolabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignssepayautolabel3(inputs);
      return vi_campaignssepayautolabel3(inputs);
    }
  );
export { campaignssepayautolabel3 as "campaignsSepayAutoLabel" };
