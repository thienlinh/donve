/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsemptytitle2Inputs */

const vi_productsemptytitle2 =
  /** @type {(inputs: Productsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có sản phẩm nào`;
  };

const en_productsemptytitle2 =
  /** @type {(inputs: Productsemptytitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No products yet`;
  };

/**
 * | output |
 * | --- |
 * | "No products yet" |
 *
 * @param {Productsemptytitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsemptytitle2 =
  /** @type {((inputs?: Productsemptytitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsemptytitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsemptytitle2(inputs);
      return vi_productsemptytitle2(inputs);
    }
  );
export { productsemptytitle2 as "productsEmptyTitle" };
