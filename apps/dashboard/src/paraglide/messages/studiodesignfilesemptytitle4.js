/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodesignfilesemptytitle4Inputs */

const vi_studiodesignfilesemptytitle4 =
  /** @type {(inputs: Studiodesignfilesemptytitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Design Files`;
  };

const en_studiodesignfilesemptytitle4 =
  /** @type {(inputs: Studiodesignfilesemptytitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Design Files`;
  };

/**
 * | output |
 * | --- |
 * | "Design Files" |
 *
 * @param {Studiodesignfilesemptytitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodesignfilesemptytitle4 =
  /** @type {((inputs?: Studiodesignfilesemptytitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodesignfilesemptytitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodesignfilesemptytitle4(inputs);
      return vi_studiodesignfilesemptytitle4(inputs);
    }
  );
export { studiodesignfilesemptytitle4 as "studioDesignFilesEmptyTitle" };
