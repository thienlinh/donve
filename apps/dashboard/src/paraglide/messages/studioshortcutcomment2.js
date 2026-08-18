/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshortcutcomment2Inputs */

const vi_studioshortcutcomment2 =
  /** @type {(inputs: Studioshortcutcomment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(C)`;
  };

const en_studioshortcutcomment2 =
  /** @type {(inputs: Studioshortcutcomment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(C)`;
  };

/**
 * | output |
 * | --- |
 * | "(C)" |
 *
 * @param {Studioshortcutcomment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshortcutcomment2 =
  /** @type {((inputs?: Studioshortcutcomment2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshortcutcomment2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshortcutcomment2(inputs);
      return vi_studioshortcutcomment2(inputs);
    }
  );
export { studioshortcutcomment2 as "studioShortcutComment" };
