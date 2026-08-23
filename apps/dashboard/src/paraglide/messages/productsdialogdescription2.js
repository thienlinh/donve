/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsdialogdescription2Inputs */

const vi_productsdialogdescription2 =
  /** @type {(inputs: Productsdialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm có thể được gắn vào một hoặc nhiều chiến dịch.`;
  };

const en_productsdialogdescription2 =
  /** @type {(inputs: Productsdialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Products can be attached to one or more campaigns.`;
  };

/**
 * | output |
 * | --- |
 * | "Products can be attached to one or more campaigns." |
 *
 * @param {Productsdialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsdialogdescription2 =
  /** @type {((inputs?: Productsdialogdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsdialogdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsdialogdescription2(inputs);
      return vi_productsdialogdescription2(inputs);
    }
  );
export { productsdialogdescription2 as "productsDialogDescription" };
