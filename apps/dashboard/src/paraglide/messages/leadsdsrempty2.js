/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrempty2Inputs */

const vi_leadsdsrempty2 =
  /** @type {(inputs: Leadsdsrempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có yêu cầu dữ liệu nào cho lead này.`;
  };

const en_leadsdsrempty2 =
  /** @type {(inputs: Leadsdsrempty2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No data-subject requests logged for this lead.`;
  };

/**
 * | output |
 * | --- |
 * | "No data-subject requests logged for this lead." |
 *
 * @param {Leadsdsrempty2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrempty2 =
  /** @type {((inputs?: Leadsdsrempty2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrempty2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrempty2(inputs);
      return vi_leadsdsrempty2(inputs);
    }
  );
export { leadsdsrempty2 as "leadsDsrEmpty" };
