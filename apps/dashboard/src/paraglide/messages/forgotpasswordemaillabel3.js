/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forgotpasswordemaillabel3Inputs */

const vi_forgotpasswordemaillabel3 =
  /** @type {(inputs: Forgotpasswordemaillabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

const en_forgotpasswordemaillabel3 =
  /** @type {(inputs: Forgotpasswordemaillabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Forgotpasswordemaillabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const forgotpasswordemaillabel3 =
  /** @type {((inputs?: Forgotpasswordemaillabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgotpasswordemaillabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_forgotpasswordemaillabel3(inputs)
      return vi_forgotpasswordemaillabel3(inputs)
    }
  )
export { forgotpasswordemaillabel3 as "forgotPasswordEmailLabel" }
