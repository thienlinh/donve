/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversionrestorebutton3Inputs */

const vi_studioversionrestorebutton3 =
  /** @type {(inputs: Studioversionrestorebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khôi phục`;
  };

const en_studioversionrestorebutton3 =
  /** @type {(inputs: Studioversionrestorebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Restore`;
  };

/**
 * | output |
 * | --- |
 * | "Restore" |
 *
 * @param {Studioversionrestorebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversionrestorebutton3 =
  /** @type {((inputs?: Studioversionrestorebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversionrestorebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversionrestorebutton3(inputs);
      return vi_studioversionrestorebutton3(inputs);
    }
  );
export { studioversionrestorebutton3 as "studioVersionRestoreButton" };
