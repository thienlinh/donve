/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookmissingbadge3Inputs */

const vi_leadswebhookmissingbadge3 =
  /** @type {(inputs: Leadswebhookmissingbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có`;
  };

const en_leadswebhookmissingbadge3 =
  /** @type {(inputs: Leadswebhookmissingbadge3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Not set`;
  };

/**
 * | output |
 * | --- |
 * | "Not set" |
 *
 * @param {Leadswebhookmissingbadge3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookmissingbadge3 =
  /** @type {((inputs?: Leadswebhookmissingbadge3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookmissingbadge3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookmissingbadge3(inputs);
      return vi_leadswebhookmissingbadge3(inputs);
    }
  );
export { leadswebhookmissingbadge3 as "leadsWebhookMissingBadge" };
