/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatsuggestionmobile3Inputs */

const vi_studiochatsuggestionmobile3 =
  /** @type {(inputs: Studiochatsuggestionmobile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cải thiện bố cục cho mobile`;
  };

const en_studiochatsuggestionmobile3 =
  /** @type {(inputs: Studiochatsuggestionmobile3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Improve the layout for mobile`;
  };

/**
 * | output |
 * | --- |
 * | "Improve the layout for mobile" |
 *
 * @param {Studiochatsuggestionmobile3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatsuggestionmobile3 =
  /** @type {((inputs?: Studiochatsuggestionmobile3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatsuggestionmobile3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatsuggestionmobile3(inputs);
      return vi_studiochatsuggestionmobile3(inputs);
    }
  );
export { studiochatsuggestionmobile3 as "studioChatSuggestionMobile" };
