/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksecretrotateplaceholder4Inputs */

const vi_leadswebhooksecretrotateplaceholder4 =
  /** @type {(inputs: Leadswebhooksecretrotateplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Để trống nếu không đổi secret hiện tại`;
  };

const en_leadswebhooksecretrotateplaceholder4 =
  /** @type {(inputs: Leadswebhooksecretrotateplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Leave blank to keep the current secret`;
  };

/**
 * | output |
 * | --- |
 * | "Leave blank to keep the current secret" |
 *
 * @param {Leadswebhooksecretrotateplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksecretrotateplaceholder4 =
  /** @type {((inputs?: Leadswebhooksecretrotateplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksecretrotateplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhooksecretrotateplaceholder4(inputs);
      return vi_leadswebhooksecretrotateplaceholder4(inputs);
    }
  );
export { leadswebhooksecretrotateplaceholder4 as "leadsWebhookSecretRotatePlaceholder" };
