/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbarrefresh2Inputs */

const vi_studiotoolbarrefresh2 =
  /** @type {(inputs: Studiotoolbarrefresh2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Làm mới canvas`;
  };

const en_studiotoolbarrefresh2 =
  /** @type {(inputs: Studiotoolbarrefresh2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Refresh canvas`;
  };

/**
 * | output |
 * | --- |
 * | "Refresh canvas" |
 *
 * @param {Studiotoolbarrefresh2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbarrefresh2 =
  /** @type {((inputs?: Studiotoolbarrefresh2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbarrefresh2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbarrefresh2(inputs);
      return vi_studiotoolbarrefresh2(inputs);
    }
  );
export { studiotoolbarrefresh2 as "studioToolbarRefresh" };
