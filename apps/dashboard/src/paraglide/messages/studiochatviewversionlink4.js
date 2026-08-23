/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiochatviewversionlink4Inputs */

const vi_studiochatviewversionlink4 =
  /** @type {(inputs: Studiochatviewversionlink4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem version này`;
  };

const en_studiochatviewversionlink4 =
  /** @type {(inputs: Studiochatviewversionlink4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `View this version`;
  };

/**
 * | output |
 * | --- |
 * | "View this version" |
 *
 * @param {Studiochatviewversionlink4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiochatviewversionlink4 =
  /** @type {((inputs?: Studiochatviewversionlink4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiochatviewversionlink4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiochatviewversionlink4(inputs);
      return vi_studiochatviewversionlink4(inputs);
    }
  );
export { studiochatviewversionlink4 as "studioChatViewVersionLink" };
