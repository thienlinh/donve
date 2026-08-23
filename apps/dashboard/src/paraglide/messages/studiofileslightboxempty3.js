/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofileslightboxempty3Inputs */

const vi_studiofileslightboxempty3 =
  /** @type {(inputs: Studiofileslightboxempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có thumbnail — sẽ tự chụp sau lần lưu tiếp theo.`;
  };

const en_studiofileslightboxempty3 =
  /** @type {(inputs: Studiofileslightboxempty3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No thumbnail captured yet — it's taken automatically after the next save.`;
  };

/**
 * | output |
 * | --- |
 * | "No thumbnail captured yet — it's taken automatically after the next save." |
 *
 * @param {Studiofileslightboxempty3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofileslightboxempty3 =
  /** @type {((inputs?: Studiofileslightboxempty3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofileslightboxempty3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofileslightboxempty3(inputs);
      return vi_studiofileslightboxempty3(inputs);
    }
  );
export { studiofileslightboxempty3 as "studioFilesLightboxEmpty" };
