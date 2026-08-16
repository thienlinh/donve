/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Resetpasswordsuccess2Inputs */

const vi_resetpasswordsuccess2 =
  /** @type {(inputs: Resetpasswordsuccess2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.`;
  };

const en_resetpasswordsuccess2 =
  /** @type {(inputs: Resetpasswordsuccess2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Password reset successfully. You can log in with your new password.`;
  };

/**
 * | output |
 * | --- |
 * | "Password reset successfully. You can log in with your new password." |
 *
 * @param {Resetpasswordsuccess2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const resetpasswordsuccess2 =
  /** @type {((inputs?: Resetpasswordsuccess2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Resetpasswordsuccess2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_resetpasswordsuccess2(inputs);
      return vi_resetpasswordsuccess2(inputs);
    }
  );
export { resetpasswordsuccess2 as "resetPasswordSuccess" };
