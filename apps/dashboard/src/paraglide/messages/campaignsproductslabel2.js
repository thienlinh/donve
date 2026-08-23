/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsproductslabel2Inputs */

const vi_campaignsproductslabel2 =
  /** @type {(inputs: Campaignsproductslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_campaignsproductslabel2 =
  /** @type {(inputs: Campaignsproductslabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Products`;
  };

/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Campaignsproductslabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsproductslabel2 =
  /** @type {((inputs?: Campaignsproductslabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsproductslabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsproductslabel2(inputs);
      return vi_campaignsproductslabel2(inputs);
    }
  );
export { campaignsproductslabel2 as "campaignsProductsLabel" };
