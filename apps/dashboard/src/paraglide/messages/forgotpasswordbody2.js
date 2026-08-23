/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forgotpasswordbody2Inputs */

const vi_forgotpasswordbody2 =
  /** @type {(inputs: Forgotpasswordbody2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhập email của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.`;
  };

const en_forgotpasswordbody2 =
  /** @type {(inputs: Forgotpasswordbody2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Enter your email and we'll send you a password reset link.`;
  };

/**
 * | output |
 * | --- |
 * | "Enter your email and we'll send you a password reset link." |
 *
 * @param {Forgotpasswordbody2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const forgotpasswordbody2 =
  /** @type {((inputs?: Forgotpasswordbody2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgotpasswordbody2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_forgotpasswordbody2(inputs);
      return vi_forgotpasswordbody2(inputs);
    }
  );
export { forgotpasswordbody2 as "forgotPasswordBody" };
