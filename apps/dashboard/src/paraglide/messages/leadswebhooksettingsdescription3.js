/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksettingsdescription3Inputs */

const vi_leadswebhooksettingsdescription3 =
  /** @type {(inputs: Leadswebhooksettingsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cấu hình secret riêng cho org để cô lập webhook khỏi các org khác — không bắt buộc, mặc định dùng secret chung của hệ thống.`;
  };

const en_leadswebhooksettingsdescription3 =
  /** @type {(inputs: Leadswebhooksettingsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Configure a secret for this org to isolate its webhook from other orgs — optional, defaults to the platform's shared secret.`;
  };

/**
 * | output |
 * | --- |
 * | "Configure a secret for this org to isolate its webhook from other orgs — optional, defaults to the platform's shared secret." |
 *
 * @param {Leadswebhooksettingsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksettingsdescription3 =
  /** @type {((inputs?: Leadswebhooksettingsdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksettingsdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksettingsdescription3(inputs);
      return vi_leadswebhooksettingsdescription3(inputs);
    }
  );
export { leadswebhooksettingsdescription3 as "leadsWebhookSettingsDescription" };
