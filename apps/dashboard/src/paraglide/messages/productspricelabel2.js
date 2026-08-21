/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productspricelabel2Inputs */

const vi_productspricelabel2 =
  /** @type {(inputs: Productspricelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giá (VNĐ)`;
  };

const en_productspricelabel2 =
  /** @type {(inputs: Productspricelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Price (VND)`;
  };

/**
 * | output |
 * | --- |
 * | "Price (VND)" |
 *
 * @param {Productspricelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productspricelabel2 =
  /** @type {((inputs?: Productspricelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productspricelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productspricelabel2(inputs);
      return vi_productspricelabel2(inputs);
    }
  );
export { productspricelabel2 as "productsPriceLabel" };
