/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signupnamelabel2Inputs */

const vi_signupnamelabel2 =
  /** @type {(inputs: Signupnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Họ tên`
  }

const en_signupnamelabel2 =
  /** @type {(inputs: Signupnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Full name`
  }

/**
 * | output |
 * | --- |
 * | "Full name" |
 *
 * @param {Signupnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signupnamelabel2 =
  /** @type {((inputs?: Signupnamelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signupnamelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signupnamelabel2(inputs)
      return vi_signupnamelabel2(inputs)
    }
  )
export { signupnamelabel2 as "signupNameLabel" }
