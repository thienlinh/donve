/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatsuggestioncta3Inputs */

const vi_studiochatsuggestioncta3 =
  /** @type {(inputs: Studiochatsuggestioncta3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Làm nút CTA nổi bật hơn`;
  };

const en_studiochatsuggestioncta3 =
  /** @type {(inputs: Studiochatsuggestioncta3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Make the CTA button stand out more`;
  };

/**
 * | output |
 * | --- |
 * | "Make the CTA button stand out more" |
 *
 * @param {Studiochatsuggestioncta3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatsuggestioncta3 =
  /** @type {((inputs?: Studiochatsuggestioncta3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatsuggestioncta3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatsuggestioncta3(inputs);
      return vi_studiochatsuggestioncta3(inputs);
    }
  );
export { studiochatsuggestioncta3 as "studioChatSuggestionCta" };
