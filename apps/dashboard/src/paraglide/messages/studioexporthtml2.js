/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioexporthtml2Inputs */

const vi_studioexporthtml2 =
  /** @type {(inputs: Studioexporthtml2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `HTML`;
  };

const en_studioexporthtml2 =
  /** @type {(inputs: Studioexporthtml2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `HTML`;
  };

/**
 * | output |
 * | --- |
 * | "HTML" |
 *
 * @param {Studioexporthtml2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioexporthtml2 =
  /** @type {((inputs?: Studioexporthtml2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioexporthtml2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioexporthtml2(inputs);
      return vi_studioexporthtml2(inputs);
    }
  );
export { studioexporthtml2 as "studioExportHtml" };
