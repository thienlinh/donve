/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillsloaderrortitle4Inputs */

const vi_studioskillsloaderrortitle4 =
  /** @type {(inputs: Studioskillsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách kỹ năng`;
  };

const en_studioskillsloaderrortitle4 =
  /** @type {(inputs: Studioskillsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load skills`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load skills" |
 *
 * @param {Studioskillsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillsloaderrortitle4 =
  /** @type {((inputs?: Studioskillsloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillsloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillsloaderrortitle4(inputs);
      return vi_studioskillsloaderrortitle4(inputs);
    }
  );
export { studioskillsloaderrortitle4 as "studioSkillsLoadErrorTitle" };
