/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiocommentsendallbutton4Inputs */

const vi_studiocommentsendallbutton4 =
  /** @type {(inputs: Studiocommentsendallbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gửi tất cả`;
  };

const en_studiocommentsendallbutton4 =
  /** @type {(inputs: Studiocommentsendallbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Send all`;
  };

/**
 * | output |
 * | --- |
 * | "Send all" |
 *
 * @param {Studiocommentsendallbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiocommentsendallbutton4 =
  /** @type {((inputs?: Studiocommentsendallbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiocommentsendallbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiocommentsendallbutton4(inputs);
      return vi_studiocommentsendallbutton4(inputs);
    }
  );
export { studiocommentsendallbutton4 as "studioCommentSendAllButton" };
