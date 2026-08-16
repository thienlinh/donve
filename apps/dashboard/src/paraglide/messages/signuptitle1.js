/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Signuptitle1Inputs */

const vi_signuptitle1 =
  /** @type {(inputs: Signuptitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo tài khoản`
  }

const en_signuptitle1 =
  /** @type {(inputs: Signuptitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create an account`
  }

/**
 * | output |
 * | --- |
 * | "Create an account" |
 *
 * @param {Signuptitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const signuptitle1 =
  /** @type {((inputs?: Signuptitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Signuptitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_signuptitle1(inputs)
      return vi_signuptitle1(inputs)
    }
  )
export { signuptitle1 as "signupTitle" }
