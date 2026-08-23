/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillremoveerrortoast3Inputs */

const vi_skillremoveerrortoast3 =
  /** @type {(inputs: Skillremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể xóa kỹ năng này. Vui lòng thử lại.`;
  };

const en_skillremoveerrortoast3 =
  /** @type {(inputs: Skillremoveerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't remove this skill. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't remove this skill. Try again." |
 *
 * @param {Skillremoveerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillremoveerrortoast3 =
  /** @type {((inputs?: Skillremoveerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillremoveerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillremoveerrortoast3(inputs);
      return vi_skillremoveerrortoast3(inputs);
    }
  );
export { skillremoveerrortoast3 as "skillRemoveErrorToast" };
