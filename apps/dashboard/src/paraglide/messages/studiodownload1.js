/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodownload1Inputs */

const vi_studiodownload1 =
  /** @type {(inputs: Studiodownload1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tải xuống`;
  };

const en_studiodownload1 =
  /** @type {(inputs: Studiodownload1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Download`;
  };

/**
 * | output |
 * | --- |
 * | "Download" |
 *
 * @param {Studiodownload1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodownload1 =
  /** @type {((inputs?: Studiodownload1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodownload1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodownload1(inputs);
      return vi_studiodownload1(inputs);
    }
  );
export { studiodownload1 as "studioDownload" };
