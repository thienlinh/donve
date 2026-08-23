/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofilesgroupfolders3Inputs */

const vi_studiofilesgroupfolders3 =
  /** @type {(inputs: Studiofilesgroupfolders3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `FOLDERS`;
  };

const en_studiofilesgroupfolders3 =
  /** @type {(inputs: Studiofilesgroupfolders3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `FOLDERS`;
  };

/**
 * | output |
 * | --- |
 * | "FOLDERS" |
 *
 * @param {Studiofilesgroupfolders3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofilesgroupfolders3 =
  /** @type {((inputs?: Studiofilesgroupfolders3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofilesgroupfolders3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofilesgroupfolders3(inputs);
      return vi_studiofilesgroupfolders3(inputs);
    }
  );
export { studiofilesgroupfolders3 as "studioFilesGroupFolders" };
