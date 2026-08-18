/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesfolderassets3Inputs */

const vi_studiofilesfolderassets3 =
  /** @type {(inputs: Studiofilesfolderassets3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `assets/`;
  };

const en_studiofilesfolderassets3 =
  /** @type {(inputs: Studiofilesfolderassets3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `assets/`;
  };

/**
 * | output |
 * | --- |
 * | "assets/" |
 *
 * @param {Studiofilesfolderassets3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesfolderassets3 =
  /** @type {((inputs?: Studiofilesfolderassets3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesfolderassets3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesfolderassets3(inputs);
      return vi_studiofilesfolderassets3(inputs);
    }
  );
export { studiofilesfolderassets3 as "studioFilesFolderAssets" };
