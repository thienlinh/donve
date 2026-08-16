/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commoncontinue1Inputs */

const vi_commoncontinue1 =
  /** @type {(inputs: Commoncontinue1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tiếp tục`
  }

const en_commoncontinue1 =
  /** @type {(inputs: Commoncontinue1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Continue`
  }

/**
 * | output |
 * | --- |
 * | "Continue" |
 *
 * @param {Commoncontinue1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commoncontinue1 =
  /** @type {((inputs?: Commoncontinue1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commoncontinue1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_commoncontinue1(inputs)
      return vi_commoncontinue1(inputs)
    }
  )
export { commoncontinue1 as "commonContinue" }
