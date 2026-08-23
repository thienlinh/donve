/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublisherrortoast3Inputs */

const vi_studiopublisherrortoast3 =
  /** @type {(inputs: Studiopublisherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thể xuất bản. Vui lòng thử lại.`;
  };

const en_studiopublisherrortoast3 =
  /** @type {(inputs: Studiopublisherrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't publish. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't publish. Try again." |
 *
 * @param {Studiopublisherrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublisherrortoast3 =
  /** @type {((inputs?: Studiopublisherrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublisherrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublisherrortoast3(inputs);
      return vi_studiopublisherrortoast3(inputs);
    }
  );
export { studiopublisherrortoast3 as "studioPublishErrorToast" };
