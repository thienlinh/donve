/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrstatuscompleted3Inputs */

const vi_leadsdsrstatuscompleted3 =
  /** @type {(inputs: Leadsdsrstatuscompleted3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã xử lý`;
  };

const en_leadsdsrstatuscompleted3 =
  /** @type {(inputs: Leadsdsrstatuscompleted3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Completed`;
  };

/**
 * | output |
 * | --- |
 * | "Completed" |
 *
 * @param {Leadsdsrstatuscompleted3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrstatuscompleted3 =
  /** @type {((inputs?: Leadsdsrstatuscompleted3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrstatuscompleted3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrstatuscompleted3(inputs);
      return vi_leadsdsrstatuscompleted3(inputs);
    }
  );
export { leadsdsrstatuscompleted3 as "leadsDsrStatusCompleted" };
