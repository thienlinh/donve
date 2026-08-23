/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbarcomment2Inputs */

const vi_studiotoolbarcomment2 =
  /** @type {(inputs: Studiotoolbarcomment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bình luận`;
  };

const en_studiotoolbarcomment2 =
  /** @type {(inputs: Studiotoolbarcomment2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Comment`;
  };

/**
 * | output |
 * | --- |
 * | "Comment" |
 *
 * @param {Studiotoolbarcomment2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbarcomment2 =
  /** @type {((inputs?: Studiotoolbarcomment2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbarcomment2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbarcomment2(inputs);
      return vi_studiotoolbarcomment2(inputs);
    }
  );
export { studiotoolbarcomment2 as "studioToolbarComment" };
