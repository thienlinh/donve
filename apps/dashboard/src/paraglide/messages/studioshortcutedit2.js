/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshortcutedit2Inputs */

const vi_studioshortcutedit2 =
  /** @type {(inputs: Studioshortcutedit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(E)`;
  };

const en_studioshortcutedit2 =
  /** @type {(inputs: Studioshortcutedit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(E)`;
  };

/**
 * | output |
 * | --- |
 * | "(E)" |
 *
 * @param {Studioshortcutedit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshortcutedit2 =
  /** @type {((inputs?: Studioshortcutedit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshortcutedit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshortcutedit2(inputs);
      return vi_studioshortcutedit2(inputs);
    }
  );
export { studioshortcutedit2 as "studioShortcutEdit" };
