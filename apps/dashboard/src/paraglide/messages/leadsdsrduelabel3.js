/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrduelabel3Inputs */

const vi_leadsdsrduelabel3 =
  /** @type {(inputs: Leadsdsrduelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hạn xử lý`;
  };

const en_leadsdsrduelabel3 =
  /** @type {(inputs: Leadsdsrduelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Due`;
  };

/**
 * | output |
 * | --- |
 * | "Due" |
 *
 * @param {Leadsdsrduelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrduelabel3 =
  /** @type {((inputs?: Leadsdsrduelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrduelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrduelabel3(inputs);
      return vi_leadsdsrduelabel3(inputs);
    }
  );
export { leadsdsrduelabel3 as "leadsDsrDueLabel" };
