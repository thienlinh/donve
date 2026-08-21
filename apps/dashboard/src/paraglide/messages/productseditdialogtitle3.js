/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productseditdialogtitle3Inputs */

const vi_productseditdialogtitle3 =
  /** @type {(inputs: Productseditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sửa sản phẩm`;
  };

const en_productseditdialogtitle3 =
  /** @type {(inputs: Productseditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit product`;
  };

/**
 * | output |
 * | --- |
 * | "Edit product" |
 *
 * @param {Productseditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productseditdialogtitle3 =
  /** @type {((inputs?: Productseditdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productseditdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productseditdialogtitle3(inputs);
      return vi_productseditdialogtitle3(inputs);
    }
  );
export { productseditdialogtitle3 as "productsEditDialogTitle" };
