/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiounpublisherrortoast3Inputs */

const vi_studiounpublisherrortoast3 =
  /** @type {(inputs: Studiounpublisherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể gỡ xuất bản. Vui lòng thử lại.`;
  };

const en_studiounpublisherrortoast3 =
  /** @type {(inputs: Studiounpublisherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't unpublish. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't unpublish. Try again." |
 *
 * @param {Studiounpublisherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiounpublisherrortoast3 =
  /** @type {((inputs?: Studiounpublisherrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiounpublisherrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiounpublisherrortoast3(inputs);
      return vi_studiounpublisherrortoast3(inputs);
    }
  );
export { studiounpublisherrortoast3 as "studioUnpublishErrorToast" };
