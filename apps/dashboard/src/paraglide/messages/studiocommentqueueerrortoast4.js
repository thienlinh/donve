/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentqueueerrortoast4Inputs */

const vi_studiocommentqueueerrortoast4 =
  /** @type {(inputs: Studiocommentqueueerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thêm được bình luận vào hàng chờ. Vui lòng thử lại.`;
  };

const en_studiocommentqueueerrortoast4 =
  /** @type {(inputs: Studiocommentqueueerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't queue the comment. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't queue the comment. Try again." |
 *
 * @param {Studiocommentqueueerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentqueueerrortoast4 =
  /** @type {((inputs?: Studiocommentqueueerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentqueueerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentqueueerrortoast4(inputs);
      return vi_studiocommentqueueerrortoast4(inputs);
    }
  );
export { studiocommentqueueerrortoast4 as "studioCommentQueueErrorToast" };
