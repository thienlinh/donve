/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportbutton2Inputs */

const vi_landingsimportbutton2 =
  /** @type {(inputs: Landingsimportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import`;
  };

const en_landingsimportbutton2 =
  /** @type {(inputs: Landingsimportbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import`;
  };

/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Landingsimportbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportbutton2 =
  /** @type {((inputs?: Landingsimportbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportbutton2(inputs);
      return vi_landingsimportbutton2(inputs);
    }
  );
export { landingsimportbutton2 as "landingsImportButton" };
