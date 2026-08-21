/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsnamelabel2Inputs */

const vi_productsnamelabel2 =
  /** @type {(inputs: Productsnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_productsnamelabel2 =
  /** @type {(inputs: Productsnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Productsnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsnamelabel2 =
  /** @type {((inputs?: Productsnamelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsnamelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsnamelabel2(inputs);
      return vi_productsnamelabel2(inputs);
    }
  );
export { productsnamelabel2 as "productsNameLabel" };
