/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsrcancel2Inputs */

const vi_leadsdsrcancel2 =
  /** @type {(inputs: Leadsdsrcancel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Huỷ`;
  };

const en_leadsdsrcancel2 =
  /** @type {(inputs: Leadsdsrcancel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cancel`;
  };

/**
 * | output |
 * | --- |
 * | "Cancel" |
 *
 * @param {Leadsdsrcancel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsrcancel2 =
  /** @type {((inputs?: Leadsdsrcancel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsrcancel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsrcancel2(inputs);
      return vi_leadsdsrcancel2(inputs);
    }
  );
export { leadsdsrcancel2 as "leadsDsrCancel" };
