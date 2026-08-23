/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrsubmit2Inputs */

const vi_leadsdsrsubmit2 =
  /** @type {(inputs: Leadsdsrsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi nhận`;
  };

const en_leadsdsrsubmit2 =
  /** @type {(inputs: Leadsdsrsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log request`;
  };

/**
 * | output |
 * | --- |
 * | "Log request" |
 *
 * @param {Leadsdsrsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrsubmit2 =
  /** @type {((inputs?: Leadsdsrsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrsubmit2(inputs);
      return vi_leadsdsrsubmit2(inputs);
    }
  );
export { leadsdsrsubmit2 as "leadsDsrSubmit" };
