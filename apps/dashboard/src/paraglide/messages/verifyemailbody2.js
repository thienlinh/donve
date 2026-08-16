/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Verifyemailbody2Inputs */

const vi_verifyemailbody2 =
  /** @type {(inputs: Verifyemailbody2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chúng tôi đã gửi một liên kết xác thực đến email bạn vừa đăng ký. Nhấn vào liên kết đó để kích hoạt tài khoản.`
  }

const en_verifyemailbody2 =
  /** @type {(inputs: Verifyemailbody2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `We sent a verification link to the email you just signed up with. Click it to activate your account.`
  }

/**
 * | output |
 * | --- |
 * | "We sent a verification link to the email you just signed up with. Click it to activate your account." |
 *
 * @param {Verifyemailbody2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const verifyemailbody2 =
  /** @type {((inputs?: Verifyemailbody2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Verifyemailbody2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_verifyemailbody2(inputs)
      return vi_verifyemailbody2(inputs)
    }
  )
export { verifyemailbody2 as "verifyEmailBody" }
