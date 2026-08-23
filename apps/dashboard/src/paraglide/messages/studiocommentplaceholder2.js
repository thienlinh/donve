/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentplaceholder2Inputs */

const vi_studiocommentplaceholder2 =
  /** @type {(inputs: Studiocommentplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mô tả vấn đề hoặc đề xuất...`;
  };

const en_studiocommentplaceholder2 =
  /** @type {(inputs: Studiocommentplaceholder2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Describe the issue or suggestion...`;
  };

/**
 * | output |
 * | --- |
 * | "Describe the issue or suggestion..." |
 *
 * @param {Studiocommentplaceholder2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentplaceholder2 =
  /** @type {((inputs?: Studiocommentplaceholder2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentplaceholder2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentplaceholder2(inputs);
      return vi_studiocommentplaceholder2(inputs);
    }
  );
export { studiocommentplaceholder2 as "studioCommentPlaceholder" };
