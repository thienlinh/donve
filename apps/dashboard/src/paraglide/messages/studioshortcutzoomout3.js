/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioshortcutzoomout3Inputs */

const vi_studioshortcutzoomout3 =
  /** @type {(inputs: Studioshortcutzoomout3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(Cmd -)`;
  };

const en_studioshortcutzoomout3 =
  /** @type {(inputs: Studioshortcutzoomout3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `(Cmd -)`;
  };

/**
 * | output |
 * | --- |
 * | "(Cmd -)" |
 *
 * @param {Studioshortcutzoomout3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioshortcutzoomout3 =
  /** @type {((inputs?: Studioshortcutzoomout3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioshortcutzoomout3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioshortcutzoomout3(inputs);
      return vi_studioshortcutzoomout3(inputs);
    }
  );
export { studioshortcutzoomout3 as "studioShortcutZoomOut" };
