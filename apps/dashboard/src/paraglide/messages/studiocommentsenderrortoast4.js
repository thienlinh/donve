/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsenderrortoast4Inputs */

const vi_studiocommentsenderrortoast4 =
  /** @type {(inputs: Studiocommentsenderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không gửi được bình luận. Vui lòng thử lại.`;
  };

const en_studiocommentsenderrortoast4 =
  /** @type {(inputs: Studiocommentsenderrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't send the comment. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't send the comment. Try again." |
 *
 * @param {Studiocommentsenderrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsenderrortoast4 =
  /** @type {((inputs?: Studiocommentsenderrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsenderrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsenderrortoast4(inputs);
      return vi_studiocommentsenderrortoast4(inputs);
    }
  );
export { studiocommentsenderrortoast4 as "studioCommentSendErrorToast" };
