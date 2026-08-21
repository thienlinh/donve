/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsaccountnamelabel3Inputs */

const vi_campaignsaccountnamelabel3 =
  /** @type {(inputs: Campaignsaccountnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên chủ tài khoản`;
  };

const en_campaignsaccountnamelabel3 =
  /** @type {(inputs: Campaignsaccountnamelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account name`;
  };

/**
 * | output |
 * | --- |
 * | "Account name" |
 *
 * @param {Campaignsaccountnamelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsaccountnamelabel3 =
  /** @type {((inputs?: Campaignsaccountnamelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsaccountnamelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsaccountnamelabel3(inputs);
      return vi_campaignsaccountnamelabel3(inputs);
    }
  );
export { campaignsaccountnamelabel3 as "campaignsAccountNameLabel" };
