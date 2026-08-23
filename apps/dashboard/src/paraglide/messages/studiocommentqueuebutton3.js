/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentqueuebutton3Inputs */

const vi_studiocommentqueuebutton3 =
  /** @type {(inputs: Studiocommentqueuebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm vào hàng chờ`;
  };

const en_studiocommentqueuebutton3 =
  /** @type {(inputs: Studiocommentqueuebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Queue`;
  };

/**
 * | output |
 * | --- |
 * | "Queue" |
 *
 * @param {Studiocommentqueuebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentqueuebutton3 =
  /** @type {((inputs?: Studiocommentqueuebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentqueuebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentqueuebutton3(inputs);
      return vi_studiocommentqueuebutton3(inputs);
    }
  );
export { studiocommentqueuebutton3 as "studioCommentQueueButton" };
