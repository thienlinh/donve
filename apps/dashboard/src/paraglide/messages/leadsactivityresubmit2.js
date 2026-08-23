/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivityresubmit2Inputs */

const vi_leadsactivityresubmit2 =
  /** @type {(inputs: Leadsactivityresubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng ký lại`;
  };

const en_leadsactivityresubmit2 =
  /** @type {(inputs: Leadsactivityresubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Resubmitted`;
  };

/**
 * | output |
 * | --- |
 * | "Resubmitted" |
 *
 * @param {Leadsactivityresubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivityresubmit2 =
  /** @type {((inputs?: Leadsactivityresubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivityresubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivityresubmit2(inputs);
      return vi_leadsactivityresubmit2(inputs);
    }
  );
export { leadsactivityresubmit2 as "leadsActivityResubmit" };
