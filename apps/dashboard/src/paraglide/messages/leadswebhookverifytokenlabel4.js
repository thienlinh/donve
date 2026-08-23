/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookverifytokenlabel4Inputs */

const vi_leadswebhookverifytokenlabel4 =
  /** @type {(inputs: Leadswebhookverifytokenlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Verify Token (chỉ Facebook)`;
  };

const en_leadswebhookverifytokenlabel4 =
  /** @type {(inputs: Leadswebhookverifytokenlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Verify token (Facebook only)`;
  };

/**
 * | output |
 * | --- |
 * | "Verify token (Facebook only)" |
 *
 * @param {Leadswebhookverifytokenlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookverifytokenlabel4 =
  /** @type {((inputs?: Leadswebhookverifytokenlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookverifytokenlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookverifytokenlabel4(inputs);
      return vi_leadswebhookverifytokenlabel4(inputs);
    }
  );
export { leadswebhookverifytokenlabel4 as "leadsWebhookVerifyTokenLabel" };
