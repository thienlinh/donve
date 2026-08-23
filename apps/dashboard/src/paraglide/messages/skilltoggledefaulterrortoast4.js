/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skilltoggledefaulterrortoast4Inputs */

const vi_skilltoggledefaulterrortoast4 =
  /** @type {(inputs: Skilltoggledefaulterrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể cập nhật cài đặt mặc định của kỹ năng này. Vui lòng thử lại.`;
  };

const en_skilltoggledefaulterrortoast4 =
  /** @type {(inputs: Skilltoggledefaulterrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't update the default setting for this skill. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't update the default setting for this skill. Try again." |
 *
 * @param {Skilltoggledefaulterrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skilltoggledefaulterrortoast4 =
  /** @type {((inputs?: Skilltoggledefaulterrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skilltoggledefaulterrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skilltoggledefaulterrortoast4(inputs);
      return vi_skilltoggledefaulterrortoast4(inputs);
    }
  );
export { skilltoggledefaulterrortoast4 as "skillToggleDefaultErrorToast" };
