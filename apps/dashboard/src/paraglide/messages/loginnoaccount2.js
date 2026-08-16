/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loginnoaccount2Inputs */

const vi_loginnoaccount2 =
  /** @type {(inputs: Loginnoaccount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có tài khoản?`
  }

const en_loginnoaccount2 =
  /** @type {(inputs: Loginnoaccount2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Don't have an account?`
  }

/**
 * | output |
 * | --- |
 * | "Don't have an account?" |
 *
 * @param {Loginnoaccount2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const loginnoaccount2 =
  /** @type {((inputs?: Loginnoaccount2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loginnoaccount2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_loginnoaccount2(inputs)
      return vi_loginnoaccount2(inputs)
    }
  )
export { loginnoaccount2 as "loginNoAccount" }
