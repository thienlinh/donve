/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooktiktokreconnectbutton4Inputs */

const vi_leadswebhooktiktokreconnectbutton4 =
  /** @type {(inputs: Leadswebhooktiktokreconnectbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối lại`;
  };

const en_leadswebhooktiktokreconnectbutton4 =
  /** @type {(inputs: Leadswebhooktiktokreconnectbutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reconnect`;
  };

/**
 * | output |
 * | --- |
 * | "Reconnect" |
 *
 * @param {Leadswebhooktiktokreconnectbutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooktiktokreconnectbutton4 =
  /** @type {((inputs?: Leadswebhooktiktokreconnectbutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooktiktokreconnectbutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooktiktokreconnectbutton4(inputs);
      return vi_leadswebhooktiktokreconnectbutton4(inputs);
    }
  );
export { leadswebhooktiktokreconnectbutton4 as "leadsWebhookTiktokReconnectButton" };
