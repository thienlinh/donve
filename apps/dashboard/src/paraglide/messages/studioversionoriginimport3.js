/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionoriginimport3Inputs */

const vi_studioversionoriginimport3 =
  /** @type {(inputs: Studioversionoriginimport3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã import`;
  };

const en_studioversionoriginimport3 =
  /** @type {(inputs: Studioversionoriginimport3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Imported`;
  };

/**
 * | output |
 * | --- |
 * | "Imported" |
 *
 * @param {Studioversionoriginimport3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionoriginimport3 =
  /** @type {((inputs?: Studioversionoriginimport3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionoriginimport3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionoriginimport3(inputs);
      return vi_studioversionoriginimport3(inputs);
    }
  );
export { studioversionoriginimport3 as "studioVersionOriginImport" };
