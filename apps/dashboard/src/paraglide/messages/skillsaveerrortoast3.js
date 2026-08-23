/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillsaveerrortoast3Inputs */

const vi_skillsaveerrortoast3 =
  /** @type {(inputs: Skillsaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể lưu kỹ năng này. Vui lòng thử lại.`;
  };

const en_skillsaveerrortoast3 =
  /** @type {(inputs: Skillsaveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't save this skill. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't save this skill. Try again." |
 *
 * @param {Skillsaveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillsaveerrortoast3 =
  /** @type {((inputs?: Skillsaveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillsaveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillsaveerrortoast3(inputs);
      return vi_skillsaveerrortoast3(inputs);
    }
  );
export { skillsaveerrortoast3 as "skillSaveErrorToast" };
