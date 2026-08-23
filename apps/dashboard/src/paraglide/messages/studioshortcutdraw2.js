/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshortcutdraw2Inputs */

const vi_studioshortcutdraw2 =
  /** @type {(inputs: Studioshortcutdraw2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(D)`;
  };

const en_studioshortcutdraw2 =
  /** @type {(inputs: Studioshortcutdraw2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(D)`;
  };

/**
 * | output |
 * | --- |
 * | "(D)" |
 *
 * @param {Studioshortcutdraw2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshortcutdraw2 =
  /** @type {((inputs?: Studioshortcutdraw2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshortcutdraw2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshortcutdraw2(inputs);
      return vi_studioshortcutdraw2(inputs);
    }
  );
export { studioshortcutdraw2 as "studioShortcutDraw" };
