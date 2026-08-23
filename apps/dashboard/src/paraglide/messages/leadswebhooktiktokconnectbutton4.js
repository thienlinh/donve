/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooktiktokconnectbutton4Inputs */

const vi_leadswebhooktiktokconnectbutton4 =
  /** @type {(inputs: Leadswebhooktiktokconnectbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối tài khoản TikTok Ads`;
  };

const en_leadswebhooktiktokconnectbutton4 =
  /** @type {(inputs: Leadswebhooktiktokconnectbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Connect TikTok Ads account`;
  };

/**
 * | output |
 * | --- |
 * | "Connect TikTok Ads account" |
 *
 * @param {Leadswebhooktiktokconnectbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooktiktokconnectbutton4 =
  /** @type {((inputs?: Leadswebhooktiktokconnectbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooktiktokconnectbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooktiktokconnectbutton4(inputs);
      return vi_leadswebhooktiktokconnectbutton4(inputs);
    }
  );
export { leadswebhooktiktokconnectbutton4 as "leadsWebhookTiktokConnectButton" };
