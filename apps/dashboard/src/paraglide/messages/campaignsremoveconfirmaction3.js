/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsremoveconfirmaction3Inputs */

const vi_campaignsremoveconfirmaction3 =
  /** @type {(inputs: Campaignsremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá chiến dịch`;
  };

const en_campaignsremoveconfirmaction3 =
  /** @type {(inputs: Campaignsremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Remove campaign" |
 *
 * @param {Campaignsremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsremoveconfirmaction3 =
  /** @type {((inputs?: Campaignsremoveconfirmaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsremoveconfirmaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsremoveconfirmaction3(inputs);
      return vi_campaignsremoveconfirmaction3(inputs);
    }
  );
export { campaignsremoveconfirmaction3 as "campaignsRemoveConfirmAction" };
