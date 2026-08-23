/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsendallerrortoast5Inputs */

const vi_studiocommentsendallerrortoast5 =
  /** @type {(inputs: Studiocommentsendallerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không gửi được các bình luận đang chờ. Vui lòng thử lại.`;
  };

const en_studiocommentsendallerrortoast5 =
  /** @type {(inputs: Studiocommentsendallerrortoast5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't send the queued comments. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't send the queued comments. Try again." |
 *
 * @param {Studiocommentsendallerrortoast5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsendallerrortoast5 =
  /** @type {((inputs?: Studiocommentsendallerrortoast5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsendallerrortoast5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsendallerrortoast5(inputs);
      return vi_studiocommentsendallerrortoast5(inputs);
    }
  );
export { studiocommentsendallerrortoast5 as "studioCommentSendAllErrorToast" };
