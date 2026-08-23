/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawpromptplaceholder3Inputs */

const vi_studiodrawpromptplaceholder3 =
  /** @type {(inputs: Studiodrawpromptplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mô tả thay đổi (không bắt buộc)...`;
  };

const en_studiodrawpromptplaceholder3 =
  /** @type {(inputs: Studiodrawpromptplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Describe the changes (optional)...`;
  };

/**
 * | output |
 * | --- |
 * | "Describe the changes (optional)..." |
 *
 * @param {Studiodrawpromptplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawpromptplaceholder3 =
  /** @type {((inputs?: Studiodrawpromptplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawpromptplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawpromptplaceholder3(inputs);
      return vi_studiodrawpromptplaceholder3(inputs);
    }
  );
export { studiodrawpromptplaceholder3 as "studioDrawPromptPlaceholder" };
