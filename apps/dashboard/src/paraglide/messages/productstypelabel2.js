/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstypelabel2Inputs */

const vi_productstypelabel2 =
  /** @type {(inputs: Productstypelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loại`;
  };

const en_productstypelabel2 =
  /** @type {(inputs: Productstypelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Type`;
  };

/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Productstypelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstypelabel2 =
  /** @type {((inputs?: Productstypelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstypelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstypelabel2(inputs);
      return vi_productstypelabel2(inputs);
    }
  );
export { productstypelabel2 as "productsTypeLabel" };
