/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentqueueempty3Inputs */

const vi_studiocommentqueueempty3 =
  /** @type {(inputs: Studiocommentqueueempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có bình luận nào trong hàng chờ.`;
  };

const en_studiocommentqueueempty3 =
  /** @type {(inputs: Studiocommentqueueempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No comments queued yet.`;
  };

/**
 * | output |
 * | --- |
 * | "No comments queued yet." |
 *
 * @param {Studiocommentqueueempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentqueueempty3 =
  /** @type {((inputs?: Studiocommentqueueempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentqueueempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentqueueempty3(inputs);
      return vi_studiocommentqueueempty3(inputs);
    }
  );
export { studiocommentqueueempty3 as "studioCommentQueueEmpty" };
