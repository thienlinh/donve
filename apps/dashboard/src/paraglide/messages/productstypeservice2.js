/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstypeservice2Inputs */

const vi_productstypeservice2 =
  /** @type {(inputs: Productstypeservice2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dịch vụ`;
  };

const en_productstypeservice2 =
  /** @type {(inputs: Productstypeservice2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Service`;
  };

/**
 * | output |
 * | --- |
 * | "Service" |
 *
 * @param {Productstypeservice2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstypeservice2 =
  /** @type {((inputs?: Productstypeservice2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstypeservice2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstypeservice2(inputs);
      return vi_productstypeservice2(inputs);
    }
  );
export { productstypeservice2 as "productsTypeService" };
