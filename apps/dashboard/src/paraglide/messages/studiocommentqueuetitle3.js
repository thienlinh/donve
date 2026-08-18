/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentqueuetitle3Inputs */

const vi_studiocommentqueuetitle3 =
  /** @type {(inputs: Studiocommentqueuetitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bình luận đang chờ`;
  };

const en_studiocommentqueuetitle3 =
  /** @type {(inputs: Studiocommentqueuetitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Queued comments`;
  };

/**
 * | output |
 * | --- |
 * | "Queued comments" |
 *
 * @param {Studiocommentqueuetitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentqueuetitle3 =
  /** @type {((inputs?: Studiocommentqueuetitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentqueuetitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentqueuetitle3(inputs);
      return vi_studiocommentqueuetitle3(inputs);
    }
  );
export { studiocommentqueuetitle3 as "studioCommentQueueTitle" };
