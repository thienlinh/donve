/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfiltersearchplaceholder3Inputs */

const vi_leadsfiltersearchplaceholder3 =
  /** @type {(inputs: Leadsfiltersearchplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên, SĐT hoặc email`;
  };

const en_leadsfiltersearchplaceholder3 =
  /** @type {(inputs: Leadsfiltersearchplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name, phone, or email`;
  };

/**
 * | output |
 * | --- |
 * | "Name, phone, or email" |
 *
 * @param {Leadsfiltersearchplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfiltersearchplaceholder3 =
  /** @type {((inputs?: Leadsfiltersearchplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfiltersearchplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfiltersearchplaceholder3(inputs);
      return vi_leadsfiltersearchplaceholder3(inputs);
    }
  );
export { leadsfiltersearchplaceholder3 as "leadsFilterSearchPlaceholder" };
