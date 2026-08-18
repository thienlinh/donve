/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsendalltoast4Inputs */

const vi_studiocommentsendalltoast4 =
  /** @type {(inputs: Studiocommentsendalltoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gửi tất cả bình luận vào chat`;
  };

const en_studiocommentsendalltoast4 =
  /** @type {(inputs: Studiocommentsendalltoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sent all comments to chat`;
  };

/**
 * | output |
 * | --- |
 * | "Sent all comments to chat" |
 *
 * @param {Studiocommentsendalltoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsendalltoast4 =
  /** @type {((inputs?: Studiocommentsendalltoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsendalltoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsendalltoast4(inputs);
      return vi_studiocommentsendalltoast4(inputs);
    }
  );
export { studiocommentsendalltoast4 as "studioCommentSendAllToast" };
