/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginforgotpassword2Inputs */

const vi_loginforgotpassword2 =
  /** @type {(inputs: Loginforgotpassword2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quên mật khẩu?`;
  };

const en_loginforgotpassword2 =
  /** @type {(inputs: Loginforgotpassword2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Forgot password?`;
  };

/**
 * | output |
 * | --- |
 * | "Forgot password?" |
 *
 * @param {Loginforgotpassword2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginforgotpassword2 =
  /** @type {((inputs?: Loginforgotpassword2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginforgotpassword2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_loginforgotpassword2(inputs);
      return vi_loginforgotpassword2(inputs);
    }
  );
export { loginforgotpassword2 as "loginForgotPassword" };
