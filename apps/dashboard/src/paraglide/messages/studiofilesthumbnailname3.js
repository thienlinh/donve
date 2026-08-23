/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesthumbnailname3Inputs */

const vi_studiofilesthumbnailname3 =
  /** @type {(inputs: Studiofilesthumbnailname3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `.thumbnail.jpg`;
  };

const en_studiofilesthumbnailname3 =
  /** @type {(inputs: Studiofilesthumbnailname3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `.thumbnail.jpg`;
  };

/**
 * | output |
 * | --- |
 * | ".thumbnail.jpg" |
 *
 * @param {Studiofilesthumbnailname3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesthumbnailname3 =
  /** @type {((inputs?: Studiofilesthumbnailname3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesthumbnailname3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesthumbnailname3(inputs);
      return vi_studiofilesthumbnailname3(inputs);
    }
  );
export { studiofilesthumbnailname3 as "studioFilesThumbnailName" };
