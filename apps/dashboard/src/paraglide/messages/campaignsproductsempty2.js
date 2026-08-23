/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsproductsempty2Inputs */

const vi_campaignsproductsempty2 =
  /** @type {(inputs: Campaignsproductsempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có sản phẩm nào — hãy thêm sản phẩm trước.`;
  };

const en_campaignsproductsempty2 =
  /** @type {(inputs: Campaignsproductsempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No products yet — add one first.`;
  };

/**
 * | output |
 * | --- |
 * | "No products yet — add one first." |
 *
 * @param {Campaignsproductsempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsproductsempty2 =
  /** @type {((inputs?: Campaignsproductsempty2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsproductsempty2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsproductsempty2(inputs);
      return vi_campaignsproductsempty2(inputs);
    }
  );
export { campaignsproductsempty2 as "campaignsProductsEmpty" };
