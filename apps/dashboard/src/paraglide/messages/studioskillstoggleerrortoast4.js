/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillstoggleerrortoast4Inputs */

const vi_studioskillstoggleerrortoast4 =
  /** @type {(inputs: Studioskillstoggleerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể cập nhật kỹ năng này cho trang. Vui lòng thử lại.`;
  };

const en_studioskillstoggleerrortoast4 =
  /** @type {(inputs: Studioskillstoggleerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't update this skill for this page. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't update this skill for this page. Try again." |
 *
 * @param {Studioskillstoggleerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillstoggleerrortoast4 =
  /** @type {((inputs?: Studioskillstoggleerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillstoggleerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillstoggleerrortoast4(inputs);
      return vi_studioskillstoggleerrortoast4(inputs);
    }
  );
export { studioskillstoggleerrortoast4 as "studioSkillsToggleErrorToast" };
