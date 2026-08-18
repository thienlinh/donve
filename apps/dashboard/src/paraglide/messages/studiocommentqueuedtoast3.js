/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentqueuedtoast3Inputs */

const vi_studiocommentqueuedtoast3 =
  /** @type {(inputs: Studiocommentqueuedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã thêm vào hàng chờ bình luận`;
  };

const en_studiocommentqueuedtoast3 =
  /** @type {(inputs: Studiocommentqueuedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Added to the comment queue`;
  };

/**
 * | output |
 * | --- |
 * | "Added to the comment queue" |
 *
 * @param {Studiocommentqueuedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentqueuedtoast3 =
  /** @type {((inputs?: Studiocommentqueuedtoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentqueuedtoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentqueuedtoast3(inputs);
      return vi_studiocommentqueuedtoast3(inputs);
    }
  );
export { studiocommentqueuedtoast3 as "studioCommentQueuedToast" };
