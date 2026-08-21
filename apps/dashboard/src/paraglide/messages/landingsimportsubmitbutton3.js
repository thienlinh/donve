/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsimportsubmitbutton3Inputs */

const vi_landingsimportsubmitbutton3 =
  /** @type {(inputs: Landingsimportsubmitbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import`;
  };

const en_landingsimportsubmitbutton3 =
  /** @type {(inputs: Landingsimportsubmitbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Import`;
  };

/**
 * | output |
 * | --- |
 * | "Import" |
 *
 * @param {Landingsimportsubmitbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsimportsubmitbutton3 =
  /** @type {((inputs?: Landingsimportsubmitbutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsimportsubmitbutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsimportsubmitbutton3(inputs);
      return vi_landingsimportsubmitbutton3(inputs);
    }
  );
export { landingsimportsubmitbutton3 as "landingsImportSubmitButton" };
