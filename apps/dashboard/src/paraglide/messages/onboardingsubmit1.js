/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingsubmit1Inputs */

const vi_onboardingsubmit1 =
  /** @type {(inputs: Onboardingsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo tổ chức`
  }

const en_onboardingsubmit1 =
  /** @type {(inputs: Onboardingsubmit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create organization`
  }

/**
 * | output |
 * | --- |
 * | "Create organization" |
 *
 * @param {Onboardingsubmit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingsubmit1 =
  /** @type {((inputs?: Onboardingsubmit1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingsubmit1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_onboardingsubmit1(inputs)
      return vi_onboardingsubmit1(inputs)
    }
  )
export { onboardingsubmit1 as "onboardingSubmit" }
