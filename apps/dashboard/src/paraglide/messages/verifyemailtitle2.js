/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Verifyemailtitle2Inputs */

const vi_verifyemailtitle2 =
  /** @type {(inputs: Verifyemailtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kiểm tra email của bạn`
  }

const en_verifyemailtitle2 =
  /** @type {(inputs: Verifyemailtitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Check your email`
  }

/**
 * | output |
 * | --- |
 * | "Check your email" |
 *
 * @param {Verifyemailtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const verifyemailtitle2 =
  /** @type {((inputs?: Verifyemailtitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Verifyemailtitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_verifyemailtitle2(inputs)
      return vi_verifyemailtitle2(inputs)
    }
  )
export { verifyemailtitle2 as "verifyEmailTitle" }
