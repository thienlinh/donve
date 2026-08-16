/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signuppasswordlabel2Inputs */

const vi_signuppasswordlabel2 =
  /** @type {(inputs: Signuppasswordlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mật khẩu`
  }

const en_signuppasswordlabel2 =
  /** @type {(inputs: Signuppasswordlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Password`
  }

/**
 * | output |
 * | --- |
 * | "Password" |
 *
 * @param {Signuppasswordlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signuppasswordlabel2 =
  /** @type {((inputs?: Signuppasswordlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signuppasswordlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signuppasswordlabel2(inputs)
      return vi_signuppasswordlabel2(inputs)
    }
  )
export { signuppasswordlabel2 as "signupPasswordLabel" }
