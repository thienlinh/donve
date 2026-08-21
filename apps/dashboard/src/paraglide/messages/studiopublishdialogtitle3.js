/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishdialogtitle3Inputs */

const vi_studiopublishdialogtitle3 =
  /** @type {(inputs: Studiopublishdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất bản`;
  };

const en_studiopublishdialogtitle3 =
  /** @type {(inputs: Studiopublishdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Publish`;
  };

/**
 * | output |
 * | --- |
 * | "Publish" |
 *
 * @param {Studiopublishdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishdialogtitle3 =
  /** @type {((inputs?: Studiopublishdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishdialogtitle3(inputs);
      return vi_studiopublishdialogtitle3(inputs);
    }
  );
export { studiopublishdialogtitle3 as "studioPublishDialogTitle" };
