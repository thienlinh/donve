/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Onboardingbody1Inputs */

const vi_onboardingbody1 =
  /** @type {(inputs: Onboardingbody1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mỗi tài khoản Donve thuộc về ít nhất một tổ chức — đây là nơi chứa landing page, chiến dịch và lead của bạn.`
  }

const en_onboardingbody1 =
  /** @type {(inputs: Onboardingbody1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Every Donve account belongs to at least one organization — this is where your landing pages, campaigns, and leads live.`
  }

/**
 * | output |
 * | --- |
 * | "Every Donve account belongs to at least one organization — this is where your landing pages, campaigns, and leads live." |
 *
 * @param {Onboardingbody1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const onboardingbody1 =
  /** @type {((inputs?: Onboardingbody1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Onboardingbody1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_onboardingbody1(inputs)
      return vi_onboardingbody1(inputs)
    }
  )
export { onboardingbody1 as "onboardingBody" }
