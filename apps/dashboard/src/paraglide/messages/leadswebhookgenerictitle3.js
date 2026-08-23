/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenerictitle3Inputs */

const vi_leadswebhookgenerictitle3 =
  /** @type {(inputs: Leadswebhookgenerictitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API tuỳ chỉnh (nguồn khác)`;
  };

const en_leadswebhookgenerictitle3 =
  /** @type {(inputs: Leadswebhookgenerictitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Custom API (any other source)`;
  };

/**
 * | output |
 * | --- |
 * | "Custom API (any other source)" |
 *
 * @param {Leadswebhookgenerictitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenerictitle3 =
  /** @type {((inputs?: Leadswebhookgenerictitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenerictitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookgenerictitle3(inputs);
      return vi_leadswebhookgenerictitle3(inputs);
    }
  );
export { leadswebhookgenerictitle3 as "leadsWebhookGenericTitle" };
