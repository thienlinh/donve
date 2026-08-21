/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactioncopyphone3Inputs */

const vi_leadsactioncopyphone3 =
  /** @type {(inputs: Leadsactioncopyphone3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Copy SĐT`;
  };

const en_leadsactioncopyphone3 =
  /** @type {(inputs: Leadsactioncopyphone3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Copy phone`;
  };

/**
 * | output |
 * | --- |
 * | "Copy phone" |
 *
 * @param {Leadsactioncopyphone3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactioncopyphone3 =
  /** @type {((inputs?: Leadsactioncopyphone3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactioncopyphone3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactioncopyphone3(inputs);
      return vi_leadsactioncopyphone3(inputs);
    }
  );
export { leadsactioncopyphone3 as "leadsActionCopyPhone" };
