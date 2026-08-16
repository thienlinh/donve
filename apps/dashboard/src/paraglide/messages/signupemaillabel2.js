/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signupemaillabel2Inputs */

const vi_signupemaillabel2 =
  /** @type {(inputs: Signupemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

const en_signupemaillabel2 =
  /** @type {(inputs: Signupemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Signupemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signupemaillabel2 =
  /** @type {((inputs?: Signupemaillabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signupemaillabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signupemaillabel2(inputs)
      return vi_signupemaillabel2(inputs)
    }
  )
export { signupemaillabel2 as "signupEmailLabel" }
