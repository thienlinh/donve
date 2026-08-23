/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcreatedialogtitle3Inputs */

const vi_skillcreatedialogtitle3 =
  /** @type {(inputs: Skillcreatedialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo kỹ năng mới`;
  };

const en_skillcreatedialogtitle3 =
  /** @type {(inputs: Skillcreatedialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create a skill`;
  };

/**
 * | output |
 * | --- |
 * | "Create a skill" |
 *
 * @param {Skillcreatedialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcreatedialogtitle3 =
  /** @type {((inputs?: Skillcreatedialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcreatedialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcreatedialogtitle3(inputs);
      return vi_skillcreatedialogtitle3(inputs);
    }
  );
export { skillcreatedialogtitle3 as "skillCreateDialogTitle" };
