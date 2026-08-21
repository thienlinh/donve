/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiounpublishsuccesstoast3Inputs */

const vi_studiounpublishsuccesstoast3 =
  /** @type {(inputs: Studiounpublishsuccesstoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gỡ xuất bản`;
  };

const en_studiounpublishsuccesstoast3 =
  /** @type {(inputs: Studiounpublishsuccesstoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unpublished`;
  };

/**
 * | output |
 * | --- |
 * | "Unpublished" |
 *
 * @param {Studiounpublishsuccesstoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiounpublishsuccesstoast3 =
  /** @type {((inputs?: Studiounpublishsuccesstoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiounpublishsuccesstoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiounpublishsuccesstoast3(inputs);
      return vi_studiounpublishsuccesstoast3(inputs);
    }
  );
export { studiounpublishsuccesstoast3 as "studioUnpublishSuccessToast" };
