/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionrestoreerrortoast4Inputs */

const vi_studioversionrestoreerrortoast4 =
  /** @type {(inputs: Studioversionrestoreerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không khôi phục được phiên bản này. Vui lòng thử lại.`;
  };

const en_studioversionrestoreerrortoast4 =
  /** @type {(inputs: Studioversionrestoreerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't restore this version. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't restore this version. Try again." |
 *
 * @param {Studioversionrestoreerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionrestoreerrortoast4 =
  /** @type {((inputs?: Studioversionrestoreerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionrestoreerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionrestoreerrortoast4(inputs);
      return vi_studioversionrestoreerrortoast4(inputs);
    }
  );
export { studioversionrestoreerrortoast4 as "studioVersionRestoreErrorToast" };
