/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioduplicateerrortoast3Inputs */

const vi_studioduplicateerrortoast3 =
  /** @type {(inputs: Studioduplicateerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không nhân bản được trang. Vui lòng thử lại.`;
  };

const en_studioduplicateerrortoast3 =
  /** @type {(inputs: Studioduplicateerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't duplicate the page. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't duplicate the page. Try again." |
 *
 * @param {Studioduplicateerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioduplicateerrortoast3 =
  /** @type {((inputs?: Studioduplicateerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioduplicateerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioduplicateerrortoast3(inputs);
      return vi_studioduplicateerrortoast3(inputs);
    }
  );
export { studioduplicateerrortoast3 as "studioDuplicateErrorToast" };
