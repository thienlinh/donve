/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznsaccesstokenplaceholder5Inputs */

const vi_leadsnotifyznsaccesstokenplaceholder5 =
  /** @type {(inputs: Leadsnotifyznsaccesstokenplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Dán access token Zalo ZNS của bạn`;
  };

const en_leadsnotifyznsaccesstokenplaceholder5 =
  /** @type {(inputs: Leadsnotifyznsaccesstokenplaceholder5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Paste your Zalo ZNS access token`;
  };

/**
 * | output |
 * | --- |
 * | "Paste your Zalo ZNS access token" |
 *
 * @param {Leadsnotifyznsaccesstokenplaceholder5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznsaccesstokenplaceholder5 =
  /** @type {((inputs?: Leadsnotifyznsaccesstokenplaceholder5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznsaccesstokenplaceholder5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsnotifyznsaccesstokenplaceholder5(inputs);
      return vi_leadsnotifyznsaccesstokenplaceholder5(inputs);
    }
  );
export { leadsnotifyznsaccesstokenplaceholder5 as "leadsNotifyZnsAccessTokenPlaceholder" };
