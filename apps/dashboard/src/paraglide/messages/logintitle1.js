/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Logintitle1Inputs */

const vi_logintitle1 =
  /** @type {(inputs: Logintitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đăng nhập`
  }

const en_logintitle1 =
  /** @type {(inputs: Logintitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Log in`
  }

/**
 * | output |
 * | --- |
 * | "Log in" |
 *
 * @param {Logintitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const logintitle1 =
  /** @type {((inputs?: Logintitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Logintitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_logintitle1(inputs)
      return vi_logintitle1(inputs)
    }
  )
export { logintitle1 as "loginTitle" }
