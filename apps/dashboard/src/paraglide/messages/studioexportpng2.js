/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioexportpng2Inputs */

const vi_studioexportpng2 =
  /** @type {(inputs: Studioexportpng2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `PNG`;
  };

const en_studioexportpng2 =
  /** @type {(inputs: Studioexportpng2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `PNG`;
  };

/**
 * | output |
 * | --- |
 * | "PNG" |
 *
 * @param {Studioexportpng2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioexportpng2 =
  /** @type {((inputs?: Studioexportpng2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioexportpng2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioexportpng2(inputs);
      return vi_studioexportpng2(inputs);
    }
  );
export { studioexportpng2 as "studioExportPng" };
