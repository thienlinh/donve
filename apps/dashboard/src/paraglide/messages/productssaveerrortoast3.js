/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productssaveerrortoast3Inputs */

const vi_productssaveerrortoast3 =
  /** @type {(inputs: Productssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không lưu được sản phẩm này. Thử lại.`;
  };

const en_productssaveerrortoast3 =
  /** @type {(inputs: Productssaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this product. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this product. Try again." |
 *
 * @param {Productssaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productssaveerrortoast3 =
  /** @type {((inputs?: Productssaveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productssaveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productssaveerrortoast3(inputs);
      return vi_productssaveerrortoast3(inputs);
    }
  );
export { productssaveerrortoast3 as "productsSaveErrorToast" };
