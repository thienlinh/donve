/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forgotpasswordsent2Inputs */

const vi_forgotpasswordsent2 =
  /** @type {(inputs: Forgotpasswordsent2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.`;
  };

const en_forgotpasswordsent2 =
  /** @type {(inputs: Forgotpasswordsent2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `If that email exists, a password reset link has been sent.`;
  };

/**
 * | output |
 * | --- |
 * | "If that email exists, a password reset link has been sent." |
 *
 * @param {Forgotpasswordsent2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const forgotpasswordsent2 =
  /** @type {((inputs?: Forgotpasswordsent2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgotpasswordsent2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_forgotpasswordsent2(inputs);
      return vi_forgotpasswordsent2(inputs);
    }
  );
export { forgotpasswordsent2 as "forgotPasswordSent" };
