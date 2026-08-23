/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsenttoast3Inputs */

const vi_studiocommentsenttoast3 =
  /** @type {(inputs: Studiocommentsenttoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gửi vào chat`;
  };

const en_studiocommentsenttoast3 =
  /** @type {(inputs: Studiocommentsenttoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sent to chat`;
  };

/**
 * | output |
 * | --- |
 * | "Sent to chat" |
 *
 * @param {Studiocommentsenttoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsenttoast3 =
  /** @type {((inputs?: Studiocommentsenttoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsenttoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsenttoast3(inputs);
      return vi_studiocommentsenttoast3(inputs);
    }
  );
export { studiocommentsenttoast3 as "studioCommentSentToast" };
