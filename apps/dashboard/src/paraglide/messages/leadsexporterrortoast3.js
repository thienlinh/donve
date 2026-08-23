/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsexporterrortoast3Inputs */

const vi_leadsexporterrortoast3 =
  /** @type {(inputs: Leadsexporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất CSV thất bại. Thử lại.`;
  };

const en_leadsexporterrortoast3 =
  /** @type {(inputs: Leadsexporterrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Failed to export CSV. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Failed to export CSV. Try again." |
 *
 * @param {Leadsexporterrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsexporterrortoast3 =
  /** @type {((inputs?: Leadsexporterrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsexporterrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsexporterrortoast3(inputs);
      return vi_leadsexporterrortoast3(inputs);
    }
  );
export { leadsexporterrortoast3 as "leadsExportErrorToast" };
