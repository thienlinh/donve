/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrnoteslabel3Inputs */

const vi_leadsdsrnoteslabel3 =
  /** @type {(inputs: Leadsdsrnoteslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ghi chú`;
  };

const en_leadsdsrnoteslabel3 =
  /** @type {(inputs: Leadsdsrnoteslabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Notes`;
  };

/**
 * | output |
 * | --- |
 * | "Notes" |
 *
 * @param {Leadsdsrnoteslabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrnoteslabel3 =
  /** @type {((inputs?: Leadsdsrnoteslabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrnoteslabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrnoteslabel3(inputs);
      return vi_leadsdsrnoteslabel3(inputs);
    }
  );
export { leadsdsrnoteslabel3 as "leadsDsrNotesLabel" };
