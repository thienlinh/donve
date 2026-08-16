/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellsettingsnav2Inputs */

const vi_shellsettingsnav2 =
  /** @type {(inputs: Shellsettingsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cài đặt`
  }

const en_shellsettingsnav2 =
  /** @type {(inputs: Shellsettingsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Settings`
  }

/**
 * | output |
 * | --- |
 * | "Settings" |
 *
 * @param {Shellsettingsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellsettingsnav2 =
  /** @type {((inputs?: Shellsettingsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellsettingsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_shellsettingsnav2(inputs)
      return vi_shellsettingsnav2(inputs)
    }
  )
export { shellsettingsnav2 as "shellSettingsNav" }
