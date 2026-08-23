/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioexport1Inputs */

const vi_studioexport1 =
  /** @type {(inputs: Studioexport1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất file`;
  };

const en_studioexport1 =
  /** @type {(inputs: Studioexport1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Export`;
  };

/**
 * | output |
 * | --- |
 * | "Export" |
 *
 * @param {Studioexport1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioexport1 =
  /** @type {((inputs?: Studioexport1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioexport1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioexport1(inputs);
      return vi_studioexport1(inputs);
    }
  );
export { studioexport1 as "studioExport" };
