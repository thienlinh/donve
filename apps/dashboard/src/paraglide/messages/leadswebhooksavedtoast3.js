/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksavedtoast3Inputs */

const vi_leadswebhooksavedtoast3 =
  /** @type {(inputs: Leadswebhooksavedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã lưu webhook`;
  };

const en_leadswebhooksavedtoast3 =
  /** @type {(inputs: Leadswebhooksavedtoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhook saved`;
  };

/**
 * | output |
 * | --- |
 * | "Webhook saved" |
 *
 * @param {Leadswebhooksavedtoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksavedtoast3 =
  /** @type {((inputs?: Leadswebhooksavedtoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksavedtoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksavedtoast3(inputs);
      return vi_leadswebhooksavedtoast3(inputs);
    }
  );
export { leadswebhooksavedtoast3 as "leadsWebhookSavedToast" };
