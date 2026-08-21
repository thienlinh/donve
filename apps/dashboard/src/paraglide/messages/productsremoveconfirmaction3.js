/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsremoveconfirmaction3Inputs */

const vi_productsremoveconfirmaction3 =
  /** @type {(inputs: Productsremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá sản phẩm`;
  };

const en_productsremoveconfirmaction3 =
  /** @type {(inputs: Productsremoveconfirmaction3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove product`;
  };

/**
 * | output |
 * | --- |
 * | "Remove product" |
 *
 * @param {Productsremoveconfirmaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsremoveconfirmaction3 =
  /** @type {((inputs?: Productsremoveconfirmaction3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsremoveconfirmaction3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsremoveconfirmaction3(inputs);
      return vi_productsremoveconfirmaction3(inputs);
    }
  );
export { productsremoveconfirmaction3 as "productsRemoveConfirmAction" };
