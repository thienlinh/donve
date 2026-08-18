/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesprojecttitle3Inputs */

const vi_studiofilesprojecttitle3 =
  /** @type {(inputs: Studiofilesprojecttitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Project`;
  };

const en_studiofilesprojecttitle3 =
  /** @type {(inputs: Studiofilesprojecttitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Project`;
  };

/**
 * | output |
 * | --- |
 * | "Project" |
 *
 * @param {Studiofilesprojecttitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesprojecttitle3 =
  /** @type {((inputs?: Studiofilesprojecttitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesprojecttitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesprojecttitle3(inputs);
      return vi_studiofilesprojecttitle3(inputs);
    }
  );
export { studiofilesprojecttitle3 as "studioFilesProjectTitle" };
