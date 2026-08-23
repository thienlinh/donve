/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstypeother2Inputs */

const vi_productstypeother2 =
  /** @type {(inputs: Productstypeother2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khác`;
  };

const en_productstypeother2 =
  /** @type {(inputs: Productstypeother2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Other`;
  };

/**
 * | output |
 * | --- |
 * | "Other" |
 *
 * @param {Productstypeother2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstypeother2 =
  /** @type {((inputs?: Productstypeother2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstypeother2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstypeother2(inputs);
      return vi_productstypeother2(inputs);
    }
  );
export { productstypeother2 as "productsTypeOther" };
