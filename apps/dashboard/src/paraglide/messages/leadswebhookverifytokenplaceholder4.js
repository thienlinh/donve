/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookverifytokenplaceholder4Inputs */

const vi_leadswebhookverifytokenplaceholder4 =
  /** @type {(inputs: Leadswebhookverifytokenplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Token dùng khi Facebook xác minh webhook URL`;
  };

const en_leadswebhookverifytokenplaceholder4 =
  /** @type {(inputs: Leadswebhookverifytokenplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Token Facebook uses to verify the webhook URL`;
  };

/**
 * | output |
 * | --- |
 * | "Token Facebook uses to verify the webhook URL" |
 *
 * @param {Leadswebhookverifytokenplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookverifytokenplaceholder4 =
  /** @type {((inputs?: Leadswebhookverifytokenplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookverifytokenplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhookverifytokenplaceholder4(inputs);
      return vi_leadswebhookverifytokenplaceholder4(inputs);
    }
  );
export { leadswebhookverifytokenplaceholder4 as "leadsWebhookVerifyTokenPlaceholder" };
