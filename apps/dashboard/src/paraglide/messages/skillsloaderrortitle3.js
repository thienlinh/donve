/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillsloaderrortitle3Inputs */

const vi_skillsloaderrortitle3 =
  /** @type {(inputs: Skillsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách kỹ năng`;
  };

const en_skillsloaderrortitle3 =
  /** @type {(inputs: Skillsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load skills`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load skills" |
 *
 * @param {Skillsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillsloaderrortitle3 =
  /** @type {((inputs?: Skillsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillsloaderrortitle3(inputs);
      return vi_skillsloaderrortitle3(inputs);
    }
  );
export { skillsloaderrortitle3 as "skillsLoadErrorTitle" };
