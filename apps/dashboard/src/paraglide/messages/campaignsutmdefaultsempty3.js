/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmdefaultsempty3Inputs */

const vi_campaignsutmdefaultsempty3 =
  /** @type {(inputs: Campaignsutmdefaultsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có tham số UTM mặc định — link không có UTM riêng sẽ không được gắn thẻ.`;
  };

const en_campaignsutmdefaultsempty3 =
  /** @type {(inputs: Campaignsutmdefaultsempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No default UTM parameters — links without their own UTM tags won't be tagged.`;
  };

/**
 * | output |
 * | --- |
 * | "No default UTM parameters — links without their own UTM tags won't be tagged." |
 *
 * @param {Campaignsutmdefaultsempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmdefaultsempty3 =
  /** @type {((inputs?: Campaignsutmdefaultsempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmdefaultsempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmdefaultsempty3(inputs);
      return vi_campaignsutmdefaultsempty3(inputs);
    }
  );
export { campaignsutmdefaultsempty3 as "campaignsUtmDefaultsEmpty" };
