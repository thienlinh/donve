/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooksharedsecretbadge4Inputs */

const vi_leadswebhooksharedsecretbadge4 =
  /** @type {(inputs: Leadswebhooksharedsecretbadge4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dùng secret chung`;
  };

const en_leadswebhooksharedsecretbadge4 =
  /** @type {(inputs: Leadswebhooksharedsecretbadge4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Using shared secret`;
  };

/**
 * | output |
 * | --- |
 * | "Using shared secret" |
 *
 * @param {Leadswebhooksharedsecretbadge4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooksharedsecretbadge4 =
  /** @type {((inputs?: Leadswebhooksharedsecretbadge4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooksharedsecretbadge4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooksharedsecretbadge4(inputs);
      return vi_leadswebhooksharedsecretbadge4(inputs);
    }
  );
export { leadswebhooksharedsecretbadge4 as "leadsWebhookSharedSecretBadge" };
