/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellthemetoggletolight4Inputs */

const vi_shellthemetoggletolight4 =
  /** @type {(inputs: Shellthemetoggletolight4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chuyển sang giao diện sáng`;
  };

const en_shellthemetoggletolight4 =
  /** @type {(inputs: Shellthemetoggletolight4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Switch to light mode`;
  };

/**
 * | output |
 * | --- |
 * | "Switch to light mode" |
 *
 * @param {Shellthemetoggletolight4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellthemetoggletolight4 =
  /** @type {((inputs?: Shellthemetoggletolight4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellthemetoggletolight4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellthemetoggletolight4(inputs);
      return vi_shellthemetoggletolight4(inputs);
    }
  );
export { shellthemetoggletolight4 as "shellThemeToggleToLight" };
