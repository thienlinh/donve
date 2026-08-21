/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsutmdefaultssectiontitle4Inputs */

const vi_campaignsutmdefaultssectiontitle4 =
  /** @type {(inputs: Campaignsutmdefaultssectiontitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tham số UTM mặc định`;
  };

const en_campaignsutmdefaultssectiontitle4 =
  /** @type {(inputs: Campaignsutmdefaultssectiontitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Default UTM parameters`;
  };

/**
 * | output |
 * | --- |
 * | "Default UTM parameters" |
 *
 * @param {Campaignsutmdefaultssectiontitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsutmdefaultssectiontitle4 =
  /** @type {((inputs?: Campaignsutmdefaultssectiontitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsutmdefaultssectiontitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsutmdefaultssectiontitle4(inputs);
      return vi_campaignsutmdefaultssectiontitle4(inputs);
    }
  );
export { campaignsutmdefaultssectiontitle4 as "campaignsUtmDefaultsSectionTitle" };
