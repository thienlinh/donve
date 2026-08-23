/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Resetpasswordtitle2Inputs */

const vi_resetpasswordtitle2 =
  /** @type {(inputs: Resetpasswordtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đặt lại mật khẩu`;
  };

const en_resetpasswordtitle2 =
  /** @type {(inputs: Resetpasswordtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reset password`;
  };

/**
 * | output |
 * | --- |
 * | "Reset password" |
 *
 * @param {Resetpasswordtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const resetpasswordtitle2 =
  /** @type {((inputs?: Resetpasswordtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Resetpasswordtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_resetpasswordtitle2(inputs);
      return vi_resetpasswordtitle2(inputs);
    }
  );
export { resetpasswordtitle2 as "resetPasswordTitle" };
