/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooktiktokadvertiserlabel4Inputs */

const vi_leadswebhooktiktokadvertiserlabel4 =
  /** @type {(inputs: Leadswebhooktiktokadvertiserlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tài khoản quảng cáo đã kết nối`;
  };

const en_leadswebhooktiktokadvertiserlabel4 =
  /** @type {(inputs: Leadswebhooktiktokadvertiserlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connected advertiser account`;
  };

/**
 * | output |
 * | --- |
 * | "Connected advertiser account" |
 *
 * @param {Leadswebhooktiktokadvertiserlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooktiktokadvertiserlabel4 =
  /** @type {((inputs?: Leadswebhooktiktokadvertiserlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooktiktokadvertiserlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooktiktokadvertiserlabel4(inputs);
      return vi_leadswebhooktiktokadvertiserlabel4(inputs);
    }
  );
export { leadswebhooktiktokadvertiserlabel4 as "leadsWebhookTiktokAdvertiserLabel" };
