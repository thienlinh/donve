/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportuploadlabel3Inputs */

const vi_leadsimportuploadlabel3 =
  /** @type {(inputs: Leadsimportuploadlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `File CSV`;
  };

const en_leadsimportuploadlabel3 =
  /** @type {(inputs: Leadsimportuploadlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `CSV file`;
  };

/**
 * | output |
 * | --- |
 * | "CSV file" |
 *
 * @param {Leadsimportuploadlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportuploadlabel3 =
  /** @type {((inputs?: Leadsimportuploadlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportuploadlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportuploadlabel3(inputs);
      return vi_leadsimportuploadlabel3(inputs);
    }
  );
export { leadsimportuploadlabel3 as "leadsImportUploadLabel" };
