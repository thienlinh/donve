/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookgenerickeyrevealedlabel5Inputs */

const vi_leadswebhookgenerickeyrevealedlabel5 =
  /** @type {(inputs: Leadswebhookgenerickeyrevealedlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `API Key của bạn`;
  };

const en_leadswebhookgenerickeyrevealedlabel5 =
  /** @type {(inputs: Leadswebhookgenerickeyrevealedlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Your API Key`;
  };

/**
 * | output |
 * | --- |
 * | "Your API Key" |
 *
 * @param {Leadswebhookgenerickeyrevealedlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookgenerickeyrevealedlabel5 =
  /** @type {((inputs?: Leadswebhookgenerickeyrevealedlabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookgenerickeyrevealedlabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhookgenerickeyrevealedlabel5(inputs);
      return vi_leadswebhookgenerickeyrevealedlabel5(inputs);
    }
  );
export { leadswebhookgenerickeyrevealedlabel5 as "leadsWebhookGenericKeyRevealedLabel" };
