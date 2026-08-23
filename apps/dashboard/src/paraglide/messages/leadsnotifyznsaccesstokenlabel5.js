/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznsaccesstokenlabel5Inputs */

const vi_leadsnotifyznsaccesstokenlabel5 =
  /** @type {(inputs: Leadsnotifyznsaccesstokenlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Access token`;
  };

const en_leadsnotifyznsaccesstokenlabel5 =
  /** @type {(inputs: Leadsnotifyznsaccesstokenlabel5Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Access token`;
  };

/**
 * | output |
 * | --- |
 * | "Access token" |
 *
 * @param {Leadsnotifyznsaccesstokenlabel5Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznsaccesstokenlabel5 =
  /** @type {((inputs?: Leadsnotifyznsaccesstokenlabel5Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznsaccesstokenlabel5Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyznsaccesstokenlabel5(inputs);
      return vi_leadsnotifyznsaccesstokenlabel5(inputs);
    }
  );
export { leadsnotifyznsaccesstokenlabel5 as "leadsNotifyZnsAccessTokenLabel" };
