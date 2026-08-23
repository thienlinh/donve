/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookconfiguredbadge3Inputs */

const vi_leadswebhookconfiguredbadge3 =
  /** @type {(inputs: Leadswebhookconfiguredbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã cấu hình riêng`;
  };

const en_leadswebhookconfiguredbadge3 =
  /** @type {(inputs: Leadswebhookconfiguredbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Configured`;
  };

/**
 * | output |
 * | --- |
 * | "Configured" |
 *
 * @param {Leadswebhookconfiguredbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookconfiguredbadge3 =
  /** @type {((inputs?: Leadswebhookconfiguredbadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookconfiguredbadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookconfiguredbadge3(inputs);
      return vi_leadswebhookconfiguredbadge3(inputs);
    }
  );
export { leadswebhookconfiguredbadge3 as "leadsWebhookConfiguredBadge" };
