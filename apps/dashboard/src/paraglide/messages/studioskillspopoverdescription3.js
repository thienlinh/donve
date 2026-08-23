/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioskillspopoverdescription3Inputs */

const vi_studioskillspopoverdescription3 =
  /** @type {(inputs: Studioskillspopoverdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi đè cài đặt mặc định của tổ chức chỉ cho trang này.`;
  };

const en_studioskillspopoverdescription3 =
  /** @type {(inputs: Studioskillspopoverdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Override the org default for just this landing page.`;
  };

/**
 * | output |
 * | --- |
 * | "Override the org default for just this landing page." |
 *
 * @param {Studioskillspopoverdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioskillspopoverdescription3 =
  /** @type {((inputs?: Studioskillspopoverdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioskillspopoverdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioskillspopoverdescription3(inputs);
      return vi_studioskillspopoverdescription3(inputs);
    }
  );
export { studioskillspopoverdescription3 as "studioSkillsPopoverDescription" };
