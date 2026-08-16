/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginpasswordlabel2Inputs */

const vi_loginpasswordlabel2 =
  /** @type {(inputs: Loginpasswordlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mật khẩu`
  }

const en_loginpasswordlabel2 =
  /** @type {(inputs: Loginpasswordlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Password`
  }

/**
 * | output |
 * | --- |
 * | "Password" |
 *
 * @param {Loginpasswordlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginpasswordlabel2 =
  /** @type {((inputs?: Loginpasswordlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginpasswordlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_loginpasswordlabel2(inputs)
      return vi_loginpasswordlabel2(inputs)
    }
  )
export { loginpasswordlabel2 as "loginPasswordLabel" }
