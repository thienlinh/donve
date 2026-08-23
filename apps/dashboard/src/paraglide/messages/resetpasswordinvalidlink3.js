/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Resetpasswordinvalidlink3Inputs */

const vi_resetpasswordinvalidlink3 =
  /** @type {(inputs: Resetpasswordinvalidlink3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.`;
  };

const en_resetpasswordinvalidlink3 =
  /** @type {(inputs: Resetpasswordinvalidlink3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This password reset link is invalid or has expired.`;
  };

/**
 * | output |
 * | --- |
 * | "This password reset link is invalid or has expired." |
 *
 * @param {Resetpasswordinvalidlink3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const resetpasswordinvalidlink3 =
  /** @type {((inputs?: Resetpasswordinvalidlink3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Resetpasswordinvalidlink3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_resetpasswordinvalidlink3(inputs);
      return vi_resetpasswordinvalidlink3(inputs);
    }
  );
export { resetpasswordinvalidlink3 as "resetPasswordInvalidLink" };
