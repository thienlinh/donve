/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsaccountnumberlabel3Inputs */

const vi_campaignsaccountnumberlabel3 =
  /** @type {(inputs: Campaignsaccountnumberlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số tài khoản`;
  };

const en_campaignsaccountnumberlabel3 =
  /** @type {(inputs: Campaignsaccountnumberlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Account number`;
  };

/**
 * | output |
 * | --- |
 * | "Account number" |
 *
 * @param {Campaignsaccountnumberlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsaccountnumberlabel3 =
  /** @type {((inputs?: Campaignsaccountnumberlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsaccountnumberlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsaccountnumberlabel3(inputs);
      return vi_campaignsaccountnumberlabel3(inputs);
    }
  );
export { campaignsaccountnumberlabel3 as "campaignsAccountNumberLabel" };
