/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiosaveshortcuthint3Inputs */

const vi_studiosaveshortcuthint3 =
  /** @type {(inputs: Studiosaveshortcuthint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lưu (⌘S)`;
  };

const en_studiosaveshortcuthint3 =
  /** @type {(inputs: Studiosaveshortcuthint3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Save (⌘S)`;
  };

/**
 * | output |
 * | --- |
 * | "Save (⌘S)" |
 *
 * @param {Studiosaveshortcuthint3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiosaveshortcuthint3 =
  /** @type {((inputs?: Studiosaveshortcuthint3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiosaveshortcuthint3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiosaveshortcuthint3(inputs);
      return vi_studiosaveshortcuthint3(inputs);
    }
  );
export { studiosaveshortcuthint3 as "studioSaveShortcutHint" };
