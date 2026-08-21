/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignscolumnproducts2Inputs */

const vi_campaignscolumnproducts2 =
  /** @type {(inputs: Campaignscolumnproducts2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_campaignscolumnproducts2 =
  /** @type {(inputs: Campaignscolumnproducts2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Products`;
  };

/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Campaignscolumnproducts2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignscolumnproducts2 =
  /** @type {((inputs?: Campaignscolumnproducts2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignscolumnproducts2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignscolumnproducts2(inputs);
      return vi_campaignscolumnproducts2(inputs);
    }
  );
export { campaignscolumnproducts2 as "campaignsColumnProducts" };
