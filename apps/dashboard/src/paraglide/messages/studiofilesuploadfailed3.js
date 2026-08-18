/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesuploadfailed3Inputs */

const vi_studiofilesuploadfailed3 =
  /** @type {(inputs: Studiofilesuploadfailed3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải lên thất bại. Thử ảnh nhỏ hơn.`;
  };

const en_studiofilesuploadfailed3 =
  /** @type {(inputs: Studiofilesuploadfailed3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Upload failed. Try a smaller image.`;
  };

/**
 * | output |
 * | --- |
 * | "Upload failed. Try a smaller image." |
 *
 * @param {Studiofilesuploadfailed3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesuploadfailed3 =
  /** @type {((inputs?: Studiofilesuploadfailed3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesuploadfailed3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesuploadfailed3(inputs);
      return vi_studiofilesuploadfailed3(inputs);
    }
  );
export { studiofilesuploadfailed3 as "studioFilesUploadFailed" };
