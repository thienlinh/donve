/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifychannelsmsoption4Inputs */

const vi_leadsnotifychannelsmsoption4 =
  /** @type {(inputs: Leadsnotifychannelsmsoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SMS (eSMS.vn)`;
  };

const en_leadsnotifychannelsmsoption4 =
  /** @type {(inputs: Leadsnotifychannelsmsoption4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SMS (eSMS.vn)`;
  };

/**
 * | output |
 * | --- |
 * | "SMS (eSMS.vn)" |
 *
 * @param {Leadsnotifychannelsmsoption4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifychannelsmsoption4 =
  /** @type {((inputs?: Leadsnotifychannelsmsoption4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifychannelsmsoption4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifychannelsmsoption4(inputs);
      return vi_leadsnotifychannelsmsoption4(inputs);
    }
  );
export { leadsnotifychannelsmsoption4 as "leadsNotifyChannelSmsOption" };
