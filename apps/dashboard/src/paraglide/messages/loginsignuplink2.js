/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginsignuplink2Inputs */

const vi_loginsignuplink2 =
  /** @type {(inputs: Loginsignuplink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng ký`
  }

const en_loginsignuplink2 =
  /** @type {(inputs: Loginsignuplink2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sign up`
  }

/**
 * | output |
 * | --- |
 * | "Sign up" |
 *
 * @param {Loginsignuplink2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginsignuplink2 =
  /** @type {((inputs?: Loginsignuplink2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginsignuplink2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_loginsignuplink2(inputs)
      return vi_loginsignuplink2(inputs)
    }
  )
export { loginsignuplink2 as "loginSignupLink" }
