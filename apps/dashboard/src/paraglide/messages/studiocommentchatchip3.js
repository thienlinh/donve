/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentchatchip3Inputs */

const vi_studiocommentchatchip3 =
  /** @type {(inputs: Studiocommentchatchip3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã bình luận trên phần tử`;
  };

const en_studiocommentchatchip3 =
  /** @type {(inputs: Studiocommentchatchip3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Commented on element`;
  };

/**
 * | output |
 * | --- |
 * | "Commented on element" |
 *
 * @param {Studiocommentchatchip3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentchatchip3 =
  /** @type {((inputs?: Studiocommentchatchip3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentchatchip3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentchatchip3(inputs);
      return vi_studiocommentchatchip3(inputs);
    }
  );
export { studiocommentchatchip3 as "studioCommentChatChip" };
