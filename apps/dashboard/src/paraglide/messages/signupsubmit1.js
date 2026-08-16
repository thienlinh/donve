/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signupsubmit1Inputs */

const vi_signupsubmit1 =
  /** @type {(inputs: Signupsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng ký`
  }

const en_signupsubmit1 =
  /** @type {(inputs: Signupsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sign up`
  }

/**
 * | output |
 * | --- |
 * | "Sign up" |
 *
 * @param {Signupsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signupsubmit1 =
  /** @type {((inputs?: Signupsubmit1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signupsubmit1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signupsubmit1(inputs)
      return vi_signupsubmit1(inputs)
    }
  )
export { signupsubmit1 as "signupSubmit" }
