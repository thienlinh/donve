/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatsuggestionheadline3Inputs */

const vi_studiochatsuggestionheadline3 =
  /** @type {(inputs: Studiochatsuggestionheadline3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Viết lại tiêu đề cho ấn tượng hơn`;
  };

const en_studiochatsuggestionheadline3 =
  /** @type {(inputs: Studiochatsuggestionheadline3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rewrite the headline to be punchier`;
  };

/**
 * | output |
 * | --- |
 * | "Rewrite the headline to be punchier" |
 *
 * @param {Studiochatsuggestionheadline3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatsuggestionheadline3 =
  /** @type {((inputs?: Studiochatsuggestionheadline3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatsuggestionheadline3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatsuggestionheadline3(inputs);
      return vi_studiochatsuggestionheadline3(inputs);
    }
  );
export { studiochatsuggestionheadline3 as "studioChatSuggestionHeadline" };
