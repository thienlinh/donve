/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookremovebutton3Inputs */

const vi_leadswebhookremovebutton3 =
  /** @type {(inputs: Leadswebhookremovebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gỡ, dùng lại secret chung`;
  };

const en_leadswebhookremovebutton3 =
  /** @type {(inputs: Leadswebhookremovebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove, fall back to shared secret`;
  };

/**
 * | output |
 * | --- |
 * | "Remove, fall back to shared secret" |
 *
 * @param {Leadswebhookremovebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookremovebutton3 =
  /** @type {((inputs?: Leadswebhookremovebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookremovebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookremovebutton3(inputs);
      return vi_leadswebhookremovebutton3(inputs);
    }
  );
export { leadswebhookremovebutton3 as "leadsWebhookRemoveButton" };
