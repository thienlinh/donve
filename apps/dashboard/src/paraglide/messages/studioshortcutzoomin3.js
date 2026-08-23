/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshortcutzoomin3Inputs */

const vi_studioshortcutzoomin3 =
  /** @type {(inputs: Studioshortcutzoomin3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(Cmd +)`;
  };

const en_studioshortcutzoomin3 =
  /** @type {(inputs: Studioshortcutzoomin3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(Cmd +)`;
  };

/**
 * | output |
 * | --- |
 * | "(Cmd +)" |
 *
 * @param {Studioshortcutzoomin3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshortcutzoomin3 =
  /** @type {((inputs?: Studioshortcutzoomin3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshortcutzoomin3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshortcutzoomin3(inputs);
      return vi_studioshortcutzoomin3(inputs);
    }
  );
export { studioshortcutzoomin3 as "studioShortcutZoomIn" };
