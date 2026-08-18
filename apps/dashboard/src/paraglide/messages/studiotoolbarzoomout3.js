/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbarzoomout3Inputs */

const vi_studiotoolbarzoomout3 =
  /** @type {(inputs: Studiotoolbarzoomout3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thu nhỏ`;
  };

const en_studiotoolbarzoomout3 =
  /** @type {(inputs: Studiotoolbarzoomout3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zoom out`;
  };

/**
 * | output |
 * | --- |
 * | "Zoom out" |
 *
 * @param {Studiotoolbarzoomout3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbarzoomout3 =
  /** @type {((inputs?: Studiotoolbarzoomout3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbarzoomout3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbarzoomout3(inputs);
      return vi_studiotoolbarzoomout3(inputs);
    }
  );
export { studiotoolbarzoomout3 as "studioToolbarZoomOut" };
