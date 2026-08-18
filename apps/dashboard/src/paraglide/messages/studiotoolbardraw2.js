/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbardraw2Inputs */

const vi_studiotoolbardraw2 =
  /** @type {(inputs: Studiotoolbardraw2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Vẽ`;
  };

const en_studiotoolbardraw2 =
  /** @type {(inputs: Studiotoolbardraw2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Draw`;
  };

/**
 * | output |
 * | --- |
 * | "Draw" |
 *
 * @param {Studiotoolbardraw2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbardraw2 =
  /** @type {((inputs?: Studiotoolbardraw2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbardraw2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbardraw2(inputs);
      return vi_studiotoolbardraw2(inputs);
    }
  );
export { studiotoolbardraw2 as "studioToolbarDraw" };
