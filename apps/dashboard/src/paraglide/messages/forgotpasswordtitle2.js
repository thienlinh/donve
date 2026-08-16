/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forgotpasswordtitle2Inputs */

const vi_forgotpasswordtitle2 =
  /** @type {(inputs: Forgotpasswordtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quên mật khẩu`
  }

const en_forgotpasswordtitle2 =
  /** @type {(inputs: Forgotpasswordtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Forgot password`
  }

/**
 * | output |
 * | --- |
 * | "Forgot password" |
 *
 * @param {Forgotpasswordtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const forgotpasswordtitle2 =
  /** @type {((inputs?: Forgotpasswordtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgotpasswordtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_forgotpasswordtitle2(inputs)
      return vi_forgotpasswordtitle2(inputs)
    }
  )
export { forgotpasswordtitle2 as "forgotPasswordTitle" }
