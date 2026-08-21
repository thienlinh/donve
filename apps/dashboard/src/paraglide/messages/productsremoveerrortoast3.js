/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsremoveerrortoast3Inputs */

const vi_productsremoveerrortoast3 =
  /** @type {(inputs: Productsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không xoá được sản phẩm này. Thử lại.`;
  };

const en_productsremoveerrortoast3 =
  /** @type {(inputs: Productsremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this product. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this product. Try again." |
 *
 * @param {Productsremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsremoveerrortoast3 =
  /** @type {((inputs?: Productsremoveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsremoveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsremoveerrortoast3(inputs);
      return vi_productsremoveerrortoast3(inputs);
    }
  );
export { productsremoveerrortoast3 as "productsRemoveErrorToast" };
