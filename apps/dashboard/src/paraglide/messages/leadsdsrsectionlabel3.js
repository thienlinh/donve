/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrsectionlabel3Inputs */

const vi_leadsdsrsectionlabel3 =
  /** @type {(inputs: Leadsdsrsectionlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Yêu cầu dữ liệu cá nhân`;
  };

const en_leadsdsrsectionlabel3 =
  /** @type {(inputs: Leadsdsrsectionlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Data-subject requests`;
  };

/**
 * | output |
 * | --- |
 * | "Data-subject requests" |
 *
 * @param {Leadsdsrsectionlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrsectionlabel3 =
  /** @type {((inputs?: Leadsdsrsectionlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrsectionlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrsectionlabel3(inputs);
      return vi_leadsdsrsectionlabel3(inputs);
    }
  );
export { leadsdsrsectionlabel3 as "leadsDsrSectionLabel" };
