/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioexportzip2Inputs */

const vi_studioexportzip2 =
  /** @type {(inputs: Studioexportzip2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `ZIP`;
  };

const en_studioexportzip2 =
  /** @type {(inputs: Studioexportzip2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `ZIP`;
  };

/**
 * | output |
 * | --- |
 * | "ZIP" |
 *
 * @param {Studioexportzip2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioexportzip2 =
  /** @type {((inputs?: Studioexportzip2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioexportzip2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioexportzip2(inputs);
      return vi_studioexportzip2(inputs);
    }
  );
export { studioexportzip2 as "studioExportZip" };
