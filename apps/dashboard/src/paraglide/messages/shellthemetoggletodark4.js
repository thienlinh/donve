/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellthemetoggletodark4Inputs */

const vi_shellthemetoggletodark4 =
  /** @type {(inputs: Shellthemetoggletodark4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chuyển sang giao diện tối`;
  };

const en_shellthemetoggletodark4 =
  /** @type {(inputs: Shellthemetoggletodark4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Switch to dark mode`;
  };

/**
 * | output |
 * | --- |
 * | "Switch to dark mode" |
 *
 * @param {Shellthemetoggletodark4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellthemetoggletodark4 =
  /** @type {((inputs?: Shellthemetoggletodark4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellthemetoggletodark4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellthemetoggletodark4(inputs);
      return vi_shellthemetoggletodark4(inputs);
    }
  );
export { shellthemetoggletodark4 as "shellThemeToggleToDark" };
