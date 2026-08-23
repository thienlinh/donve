/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsremoveerrortoast3Inputs */

const vi_campaignsremoveerrortoast3 =
  /** @type {(inputs: Campaignsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xoá được chiến dịch này. Thử lại.`;
  };

const en_campaignsremoveerrortoast3 =
  /** @type {(inputs: Campaignsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this campaign. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this campaign. Try again." |
 *
 * @param {Campaignsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsremoveerrortoast3 =
  /** @type {((inputs?: Campaignsremoveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsremoveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsremoveerrortoast3(inputs);
      return vi_campaignsremoveerrortoast3(inputs);
    }
  );
export { campaignsremoveerrortoast3 as "campaignsRemoveErrorToast" };
