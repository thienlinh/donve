/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifychannelznsoption4Inputs */

const vi_leadsnotifychannelznsoption4 =
  /** @type {(inputs: Leadsnotifychannelznsoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo ZNS`;
  };

const en_leadsnotifychannelznsoption4 =
  /** @type {(inputs: Leadsnotifychannelznsoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo ZNS`;
  };

/**
 * | output |
 * | --- |
 * | "Zalo ZNS" |
 *
 * @param {Leadsnotifychannelznsoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifychannelznsoption4 =
  /** @type {((inputs?: Leadsnotifychannelznsoption4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifychannelznsoption4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifychannelznsoption4(inputs);
      return vi_leadsnotifychannelznsoption4(inputs);
    }
  );
export { leadsnotifychannelznsoption4 as "leadsNotifyChannelZnsOption" };
