/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsdsraddbutton3Inputs */

const vi_leadsdsraddbutton3 =
  /** @type {(inputs: Leadsdsraddbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `+ Ghi nhận yêu cầu`;
  };

const en_leadsdsraddbutton3 =
  /** @type {(inputs: Leadsdsraddbutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `+ Log request`;
  };

/**
 * | output |
 * | --- |
 * | "+ Log request" |
 *
 * @param {Leadsdsraddbutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsdsraddbutton3 =
  /** @type {((inputs?: Leadsdsraddbutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsdsraddbutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsdsraddbutton3(inputs);
      return vi_leadsdsraddbutton3(inputs);
    }
  );
export { leadsdsraddbutton3 as "leadsDsrAddButton" };
