/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesfolderscreenshots3Inputs */

const vi_studiofilesfolderscreenshots3 =
  /** @type {(inputs: Studiofilesfolderscreenshots3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `screenshots/`;
  };

const en_studiofilesfolderscreenshots3 =
  /** @type {(inputs: Studiofilesfolderscreenshots3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `screenshots/`;
  };

/**
 * | output |
 * | --- |
 * | "screenshots/" |
 *
 * @param {Studiofilesfolderscreenshots3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesfolderscreenshots3 =
  /** @type {((inputs?: Studiofilesfolderscreenshots3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesfolderscreenshots3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesfolderscreenshots3(inputs);
      return vi_studiofilesfolderscreenshots3(inputs);
    }
  );
export { studiofilesfolderscreenshots3 as "studioFilesFolderScreenshots" };
