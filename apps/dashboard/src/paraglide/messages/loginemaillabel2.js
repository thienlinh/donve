/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginemaillabel2Inputs */

const vi_loginemaillabel2 =
  /** @type {(inputs: Loginemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

const en_loginemaillabel2 =
  /** @type {(inputs: Loginemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`
  }

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Loginemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginemaillabel2 =
  /** @type {((inputs?: Loginemaillabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginemaillabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_loginemaillabel2(inputs)
      return vi_loginemaillabel2(inputs)
    }
  )
export { loginemaillabel2 as "loginEmailLabel" }
