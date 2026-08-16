/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shelllandingsnav2Inputs */

const vi_shelllandingsnav2 =
  /** @type {(inputs: Shelllandingsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing Pages`
  }

const en_shelllandingsnav2 =
  /** @type {(inputs: Shelllandingsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Landing Pages`
  }

/**
 * | output |
 * | --- |
 * | "Landing Pages" |
 *
 * @param {Shelllandingsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shelllandingsnav2 =
  /** @type {((inputs?: Shelllandingsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shelllandingsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_shelllandingsnav2(inputs)
      return vi_shelllandingsnav2(inputs)
    }
  )
export { shelllandingsnav2 as "shellLandingsNav" }
