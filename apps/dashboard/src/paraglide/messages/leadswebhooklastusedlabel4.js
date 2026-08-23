/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooklastusedlabel4Inputs */

const vi_leadswebhooklastusedlabel4 =
  /** @type {(inputs: Leadswebhooklastusedlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lần dùng gần nhất`;
  };

const en_leadswebhooklastusedlabel4 =
  /** @type {(inputs: Leadswebhooklastusedlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Last used`;
  };

/**
 * | output |
 * | --- |
 * | "Last used" |
 *
 * @param {Leadswebhooklastusedlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooklastusedlabel4 =
  /** @type {((inputs?: Leadswebhooklastusedlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooklastusedlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooklastusedlabel4(inputs);
      return vi_leadswebhooklastusedlabel4(inputs);
    }
  );
export { leadswebhooklastusedlabel4 as "leadsWebhookLastUsedLabel" };
