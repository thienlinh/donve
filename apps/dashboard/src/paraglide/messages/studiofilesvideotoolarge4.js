/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesvideotoolarge4Inputs */

const vi_studiofilesvideotoolarge4 =
  /** @type {(inputs: Studiofilesvideotoolarge4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Video quá lớn (tối đa 50MB). Thử video nhỏ hơn.`;
  };

const en_studiofilesvideotoolarge4 =
  /** @type {(inputs: Studiofilesvideotoolarge4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Video is too large (max 50MB). Try a smaller file.`;
  };

/**
 * | output |
 * | --- |
 * | "Video is too large (max 50MB). Try a smaller file." |
 *
 * @param {Studiofilesvideotoolarge4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesvideotoolarge4 =
  /** @type {((inputs?: Studiofilesvideotoolarge4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesvideotoolarge4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesvideotoolarge4(inputs);
      return vi_studiofilesvideotoolarge4(inputs);
    }
  );
export { studiofilesvideotoolarge4 as "studioFilesVideoTooLarge" };
