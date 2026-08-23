/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookneverusedlabel4Inputs */

const vi_leadswebhookneverusedlabel4 =
  /** @type {(inputs: Leadswebhookneverusedlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa từng được dùng`;
  };

const en_leadswebhookneverusedlabel4 =
  /** @type {(inputs: Leadswebhookneverusedlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Never used yet`;
  };

/**
 * | output |
 * | --- |
 * | "Never used yet" |
 *
 * @param {Leadswebhookneverusedlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookneverusedlabel4 =
  /** @type {((inputs?: Leadswebhookneverusedlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookneverusedlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookneverusedlabel4(inputs);
      return vi_leadswebhookneverusedlabel4(inputs);
    }
  );
export { leadswebhookneverusedlabel4 as "leadsWebhookNeverUsedLabel" };
