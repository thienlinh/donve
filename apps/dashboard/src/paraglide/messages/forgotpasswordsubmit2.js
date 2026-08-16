/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forgotpasswordsubmit2Inputs */

const vi_forgotpasswordsubmit2 =
  /** @type {(inputs: Forgotpasswordsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gửi liên kết`
  }

const en_forgotpasswordsubmit2 =
  /** @type {(inputs: Forgotpasswordsubmit2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Send link`
  }

/**
 * | output |
 * | --- |
 * | "Send link" |
 *
 * @param {Forgotpasswordsubmit2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const forgotpasswordsubmit2 =
  /** @type {((inputs?: Forgotpasswordsubmit2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forgotpasswordsubmit2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_forgotpasswordsubmit2(inputs)
      return vi_forgotpasswordsubmit2(inputs)
    }
  )
export { forgotpasswordsubmit2 as "forgotPasswordSubmit" }
