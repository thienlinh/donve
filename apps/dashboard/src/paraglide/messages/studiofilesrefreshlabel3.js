/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesrefreshlabel3Inputs */

const vi_studiofilesrefreshlabel3 =
  /** @type {(inputs: Studiofilesrefreshlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Làm mới`;
  };

const en_studiofilesrefreshlabel3 =
  /** @type {(inputs: Studiofilesrefreshlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Refresh`;
  };

/**
 * | output |
 * | --- |
 * | "Refresh" |
 *
 * @param {Studiofilesrefreshlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesrefreshlabel3 =
  /** @type {((inputs?: Studiofilesrefreshlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesrefreshlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesrefreshlabel3(inputs);
      return vi_studiofilesrefreshlabel3(inputs);
    }
  );
export { studiofilesrefreshlabel3 as "studioFilesRefreshLabel" };
