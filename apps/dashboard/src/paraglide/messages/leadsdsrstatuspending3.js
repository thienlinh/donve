/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrstatuspending3Inputs */

const vi_leadsdsrstatuspending3 =
  /** @type {(inputs: Leadsdsrstatuspending3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang chờ xử lý`;
  };

const en_leadsdsrstatuspending3 =
  /** @type {(inputs: Leadsdsrstatuspending3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pending`;
  };

/**
 * | output |
 * | --- |
 * | "Pending" |
 *
 * @param {Leadsdsrstatuspending3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrstatuspending3 =
  /** @type {((inputs?: Leadsdsrstatuspending3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrstatuspending3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrstatuspending3(inputs);
      return vi_leadsdsrstatuspending3(inputs);
    }
  );
export { leadsdsrstatuspending3 as "leadsDsrStatusPending" };
