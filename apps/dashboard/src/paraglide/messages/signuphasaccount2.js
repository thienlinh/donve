/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signuphasaccount2Inputs */

const vi_signuphasaccount2 =
  /** @type {(inputs: Signuphasaccount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã có tài khoản?`
  }

const en_signuphasaccount2 =
  /** @type {(inputs: Signuphasaccount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Already have an account?`
  }

/**
 * | output |
 * | --- |
 * | "Already have an account?" |
 *
 * @param {Signuphasaccount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signuphasaccount2 =
  /** @type {((inputs?: Signuphasaccount2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signuphasaccount2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signuphasaccount2(inputs)
      return vi_signuphasaccount2(inputs)
    }
  )
export { signuphasaccount2 as "signupHasAccount" }
