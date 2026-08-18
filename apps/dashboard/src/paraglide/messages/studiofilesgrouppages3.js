/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesgrouppages3Inputs */

const vi_studiofilesgrouppages3 =
  /** @type {(inputs: Studiofilesgrouppages3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `PAGES`;
  };

const en_studiofilesgrouppages3 =
  /** @type {(inputs: Studiofilesgrouppages3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `PAGES`;
  };

/**
 * | output |
 * | --- |
 * | "PAGES" |
 *
 * @param {Studiofilesgrouppages3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesgrouppages3 =
  /** @type {((inputs?: Studiofilesgrouppages3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesgrouppages3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesgrouppages3(inputs);
      return vi_studiofilesgrouppages3(inputs);
    }
  );
export { studiofilesgrouppages3 as "studioFilesGroupPages" };
