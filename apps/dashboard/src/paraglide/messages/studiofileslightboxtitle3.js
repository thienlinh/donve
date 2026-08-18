/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofileslightboxtitle3Inputs */

const vi_studiofileslightboxtitle3 =
  /** @type {(inputs: Studiofileslightboxtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem ảnh thumbnail`;
  };

const en_studiofileslightboxtitle3 =
  /** @type {(inputs: Studiofileslightboxtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thumbnail preview`;
  };

/**
 * | output |
 * | --- |
 * | "Thumbnail preview" |
 *
 * @param {Studiofileslightboxtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofileslightboxtitle3 =
  /** @type {((inputs?: Studiofileslightboxtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofileslightboxtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofileslightboxtitle3(inputs);
      return vi_studiofileslightboxtitle3(inputs);
    }
  );
export { studiofileslightboxtitle3 as "studioFilesLightboxTitle" };
