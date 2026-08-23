/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookpageaccesstokenplaceholder5Inputs */

const vi_leadswebhookpageaccesstokenplaceholder5 =
  /** @type {(inputs: Leadswebhookpageaccesstokenplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán Page Access Token từ Graph API Explorer`;
  };

const en_leadswebhookpageaccesstokenplaceholder5 =
  /** @type {(inputs: Leadswebhookpageaccesstokenplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste the Page Access Token from Graph API Explorer`;
  };

/**
 * | output |
 * | --- |
 * | "Paste the Page Access Token from Graph API Explorer" |
 *
 * @param {Leadswebhookpageaccesstokenplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookpageaccesstokenplaceholder5 =
  /** @type {((inputs?: Leadswebhookpageaccesstokenplaceholder5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookpageaccesstokenplaceholder5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadswebhookpageaccesstokenplaceholder5(inputs);
      return vi_leadswebhookpageaccesstokenplaceholder5(inputs);
    }
  );
export { leadswebhookpageaccesstokenplaceholder5 as "leadsWebhookPageAccessTokenPlaceholder" };
