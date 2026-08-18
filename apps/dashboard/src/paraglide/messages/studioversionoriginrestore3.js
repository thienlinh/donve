/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionoriginrestore3Inputs */

const vi_studioversionoriginrestore3 =
  /** @type {(inputs: Studioversionoriginrestore3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã khôi phục`;
  };

const en_studioversionoriginrestore3 =
  /** @type {(inputs: Studioversionoriginrestore3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Restored`;
  };

/**
 * | output |
 * | --- |
 * | "Restored" |
 *
 * @param {Studioversionoriginrestore3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionoriginrestore3 =
  /** @type {((inputs?: Studioversionoriginrestore3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionoriginrestore3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionoriginrestore3(inputs);
      return vi_studioversionoriginrestore3(inputs);
    }
  );
export { studioversionoriginrestore3 as "studioVersionOriginRestore" };
