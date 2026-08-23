/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookpageaccesstokenlabel5Inputs */

const vi_leadswebhookpageaccesstokenlabel5 =
  /** @type {(inputs: Leadswebhookpageaccesstokenlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Page Access Token`;
  };

const en_leadswebhookpageaccesstokenlabel5 =
  /** @type {(inputs: Leadswebhookpageaccesstokenlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Page Access Token`;
  };

/**
 * | output |
 * | --- |
 * | "Page Access Token" |
 *
 * @param {Leadswebhookpageaccesstokenlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookpageaccesstokenlabel5 =
  /** @type {((inputs?: Leadswebhookpageaccesstokenlabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookpageaccesstokenlabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookpageaccesstokenlabel5(inputs);
      return vi_leadswebhookpageaccesstokenlabel5(inputs);
    }
  );
export { leadswebhookpageaccesstokenlabel5 as "leadsWebhookPageAccessTokenLabel" };
