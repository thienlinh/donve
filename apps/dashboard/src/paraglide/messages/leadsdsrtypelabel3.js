/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrtypelabel3Inputs */

const vi_leadsdsrtypelabel3 =
  /** @type {(inputs: Leadsdsrtypelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loại yêu cầu`;
  };

const en_leadsdsrtypelabel3 =
  /** @type {(inputs: Leadsdsrtypelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Request type`;
  };

/**
 * | output |
 * | --- |
 * | "Request type" |
 *
 * @param {Leadsdsrtypelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrtypelabel3 =
  /** @type {((inputs?: Leadsdsrtypelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrtypelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrtypelabel3(inputs);
      return vi_leadsdsrtypelabel3(inputs);
    }
  );
export { leadsdsrtypelabel3 as "leadsDsrTypeLabel" };
