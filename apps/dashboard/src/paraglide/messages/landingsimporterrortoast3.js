/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimporterrortoast3Inputs */

const vi_landingsimporterrortoast3 =
  /** @type {(inputs: Landingsimporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không import được trang này. Kiểm tra lại nội dung/link rồi thử lại.`;
  };

const en_landingsimporterrortoast3 =
  /** @type {(inputs: Landingsimporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't import this page. Check the content/link and try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't import this page. Check the content/link and try again." |
 *
 * @param {Landingsimporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimporterrortoast3 =
  /** @type {((inputs?: Landingsimporterrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimporterrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimporterrortoast3(inputs);
      return vi_landingsimporterrortoast3(inputs);
    }
  );
export { landingsimporterrortoast3 as "landingsImportErrorToast" };
