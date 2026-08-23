/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesuploadlabel3Inputs */

const vi_studiofilesuploadlabel3 =
  /** @type {(inputs: Studiofilesuploadlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải ảnh hoặc video lên`;
  };

const en_studiofilesuploadlabel3 =
  /** @type {(inputs: Studiofilesuploadlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Upload image or video`;
  };

/**
 * | output |
 * | --- |
 * | "Upload image or video" |
 *
 * @param {Studiofilesuploadlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesuploadlabel3 =
  /** @type {((inputs?: Studiofilesuploadlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesuploadlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesuploadlabel3(inputs);
      return vi_studiofilesuploadlabel3(inputs);
    }
  );
export { studiofilesuploadlabel3 as "studioFilesUploadLabel" };
